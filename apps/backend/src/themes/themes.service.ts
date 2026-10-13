import { createHash } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { MediaKind, Prisma, Theme, User } from '@prisma/client';
import {
  BUILTIN_THEMES,
  BUILTIN_THEME_VALUES,
  type BuiltinTheme,
  DEFAULT_THEME,
  isBuiltinAsset,
  type ThemeAccessibility,
  type ThemeOverrides,
  type ThemeValues,
  mergeTheme,
  themeAccessibility,
  themeMediaIds,
  themeOverridesInput,
} from '@quiz-dock/contracts';
import { isManager } from '../auth/roles';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateThemeDto,
  ThemeAssetResultDto,
  ThemeDto,
  ThemeListDto,
  UpdateThemeDto,
} from './dto/theme.dto';
import { checkFont, sanitiseIcon } from './theme-assets';

/** A quiz's theme, or the instance's default: a shipped one, or one of the library. */
export type ThemeRef = { builtin: BuiltinTheme } | { id: string };

/** A reference as the API takes it: one of its two keys set. */
export function toThemeRef(r: { builtin?: BuiltinTheme; id?: string }): ThemeRef {
  return r.id ? { id: r.id } : { builtin: r.builtin ?? DEFAULT_THEME };
}

/** A theme ready to be shown: its values, and the URL of each file they point to. */
export interface ResolvedTheme {
  values: ThemeValues;
  media: Record<string, string>;
}

/** Where the instance's default theme is kept (`instance_setting`). */
export const DEFAULT_THEME_KEY = 'theme.default';

export const isBuiltin = (key: string): key is BuiltinTheme =>
  (BUILTIN_THEMES as readonly string[]).includes(key);

const WITH = {
  owner: { select: { id: true, displayName: true } },
  _count: { select: { quizzes: true } },
  media: { select: { media: { select: { id: true, url: true, name: true } } } },
} satisfies Prisma.ThemeInclude;
type ThemeRow = Prisma.ThemeGetPayload<{ include: typeof WITH }>;

/**
 * The library of quiz themes (docs/themes.md): any host creates themes and owns them,
 * every host may use every theme, an administrator may edit or delete any of them and
 * sets the instance's default.
 */
@Injectable()
export class ThemesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  async list(user: User): Promise<ThemeListDto> {
    const [rows, defaultTheme] = await Promise.all([
      this.prisma.theme.findMany({ include: WITH, orderBy: { updatedAt: 'desc' } }),
      this.defaultRef(),
    ]);
    return { themes: rows.map((r) => this.toDto(r, user, defaultTheme)), defaultTheme };
  }

  async get(user: User, id: string): Promise<ThemeDto> {
    return this.toDto(await this.row(id), user, await this.defaultRef());
  }

  async create(user: User, body: CreateThemeDto): Promise<ThemeDto> {
    const overrides = themeOverridesInput.parse(body.overrides);
    await this.checkMedia(user, overrides, []);
    const created = await this.prisma.theme.create({
      data: {
        ownerId: user.id,
        name: body.name,
        parent: body.parent,
        ...(await this.computed(body.parent, overrides)),
        media: { create: themeMediaIds(overrides).map((mediaId) => ({ mediaId })) },
      },
    });
    return this.get(user, created.id);
  }

  async update(user: User, id: string, body: UpdateThemeDto): Promise<ThemeDto> {
    const current = await this.editable(user, id);
    const parent = body.parent ?? (current.parent as BuiltinTheme);
    const overrides = body.overrides ?? themeOverridesInput.parse(current.overrides);
    const kept = themeMediaIds(themeOverridesInput.parse(current.overrides));
    await this.checkMedia(user, overrides, kept);
    await this.prisma.$transaction([
      this.prisma.themeMedia.deleteMany({ where: { themeId: id } }),
      this.prisma.theme.update({
        where: { id },
        data: {
          ...(body.name !== undefined ? { name: body.name } : {}),
          ...(body.license !== undefined ? { license: body.license } : {}),
          parent,
          ...(await this.computed(parent, overrides)),
          media: { create: themeMediaIds(overrides).map((mediaId) => ({ mediaId })) },
        },
      }),
    ]);
    return this.get(user, id);
  }

  /** A copy owned by the caller: any theme may be the start of one's own. */
  async duplicate(user: User, id: string, name: string): Promise<ThemeDto> {
    const source = await this.row(id);
    const overrides = themeOverridesInput.parse(source.overrides);
    const created = await this.prisma.theme.create({
      data: {
        ownerId: user.id,
        name,
        parent: source.parent,
        overrides: source.overrides as Prisma.InputJsonValue,
        accessibility: source.accessibility as Prisma.InputJsonValue,
        fingerprint: source.fingerprint,
        license: source.license,
        media: { create: themeMediaIds(overrides).map((mediaId) => ({ mediaId })) },
      },
    });
    return this.get(user, created.id);
  }

  /** Refused while a quiz uses it or it is the instance's default (UI-SYSTEM §1.1). */
  async remove(user: User, id: string): Promise<void> {
    await this.editable(user, id);
    const quizzes = await this.prisma.quiz.count({ where: { themeId: id } });
    if (quizzes) throw new ConflictException({ code: 'theme.in_use', params: { count: quizzes } });
    const def = await this.defaultRef();
    if ('id' in def && def.id === id) throw new ConflictException('theme.is_default');
    await this.prisma.theme.delete({ where: { id } });
  }

  /** A theme's own file: an icon (SVG, sanitised) or a font (woff2). */
  async uploadAsset(
    user: User,
    kind: 'icon' | 'font',
    file: { buffer: Buffer; originalname?: string } | undefined,
  ): Promise<ThemeAssetResultDto> {
    if (!file) throw new BadRequestException('media.file_missing');
    if (kind === 'icon') {
      const icon = sanitiseIcon(file.buffer);
      const stored = await this.media.storeThemeAsset(
        user.id,
        Buffer.from(icon.svg, 'utf8'),
        'icon',
        file.originalname,
      );
      return { ...stored, strokeRemoved: icon.strokeRemoved };
    }
    checkFont(file.buffer);
    const stored = await this.media.storeThemeAsset(
      user.id,
      file.buffer,
      'font',
      file.originalname,
    );
    return { ...stored, strokeRemoved: false };
  }

  async defaultRef(): Promise<ThemeRef> {
    const value = (
      await this.prisma.instanceSetting.findUnique({ where: { key: DEFAULT_THEME_KEY } })
    )?.value;
    if (!value) return { builtin: DEFAULT_THEME };
    return isBuiltin(value) ? { builtin: value } : { id: value };
  }

  async setDefault(user: User, ref: ThemeRef): Promise<ThemeListDto> {
    if (!isManager(user.roles)) throw new ForbiddenException('auth.admin_required');
    if ('id' in ref) await this.row(ref.id);
    const value = 'id' in ref ? ref.id : ref.builtin;
    await this.prisma.instanceSetting.upsert({
      where: { key: DEFAULT_THEME_KEY },
      create: { key: DEFAULT_THEME_KEY, value, updatedBy: user.displayName, userId: user.id },
      update: { value, updatedBy: user.displayName, userId: user.id },
    });
    return this.list(user);
  }

  /**
   * The theme a quiz shows in (docs/themes.md): its own, else the instance's default,
   * else *Classic*. A theme gone since is replaced by the default.
   */
  async resolve(ref: ThemeRef | null): Promise<ResolvedTheme> {
    const tryRef = async (r: ThemeRef): Promise<ResolvedTheme | null> => {
      if ('builtin' in r) return { values: BUILTIN_THEME_VALUES[r.builtin], media: {} };
      const row = await this.prisma.theme.findUnique({ where: { id: r.id }, include: WITH });
      if (!row || !isBuiltin(row.parent)) return null;
      return {
        values: mergeTheme(
          BUILTIN_THEME_VALUES[row.parent],
          themeOverridesInput.parse(row.overrides),
        ),
        media: Object.fromEntries(row.media.map((m) => [m.media.id, m.media.url])),
      };
    };
    return (
      (ref && (await tryRef(ref))) ??
      (await tryRef(await this.defaultRef())) ?? {
        values: BUILTIN_THEME_VALUES[DEFAULT_THEME],
        media: {},
      }
    );
  }

  /** A quiz's theme reference, from its two columns. */
  static refOf(quiz: { themeId: string | null; themeBuiltin: string | null }): ThemeRef | null {
    if (quiz.themeId) return { id: quiz.themeId };
    if (quiz.themeBuiltin && isBuiltin(quiz.themeBuiltin)) return { builtin: quiz.themeBuiltin };
    return null;
  }

  private async row(id: string): Promise<ThemeRow> {
    const row = await this.prisma.theme.findUnique({ where: { id }, include: WITH });
    if (!row) throw new NotFoundException('theme.not_found');
    return row;
  }

  /** Its owner's, or any for an administrator; another host's is read-only to them. */
  private async editable(user: User, id: string): Promise<Theme> {
    const row = await this.row(id);
    if (row.ownerId !== user.id && !isManager(user.roles)) {
      throw new ForbiddenException('theme.not_owner');
    }
    return row;
  }

  /**
   * Every file the overrides point to exists, is of the kind its place takes, and is
   * the editor's own or already the theme's.
   */
  private async checkMedia(user: User, overrides: ThemeOverrides, kept: string[]): Promise<void> {
    const wanted = new Map<string, MediaKind>();
    // An icon of the bank or a shipped picture is no file of the theme's.
    const own = (ref: string | null | undefined): ref is string => !!ref && !isBuiltinAsset(ref);
    if (own(overrides.background?.image)) wanted.set(overrides.background.image, 'image');
    for (const slot of Object.values(overrides.slots ?? {}))
      if (own(slot?.icon)) wanted.set(slot.icon, 'icon');
    if (overrides.font && 'file' in overrides.font) wanted.set(overrides.font.file, 'font');
    for (const id of Object.values(overrides.sounds ?? {})) if (id) wanted.set(id, 'audio');
    if (!wanted.size) return;
    const found = await this.prisma.mediaAsset.findMany({
      where: { id: { in: [...wanted.keys()] } },
      select: { id: true, kind: true, ownerId: true, instance: true },
    });
    for (const [id, kind] of wanted) {
      const m = found.find((f) => f.id === id);
      const reachable = m && (m.ownerId === user.id || m.instance || kept.includes(id));
      if (!reachable || m.kind !== kind) {
        throw new BadRequestException({ code: 'theme.invalid_media', params: { kind } });
      }
    }
  }

  /** What a save recomputes: the overrides as stored, the accessibility, the fingerprint. */
  private async computed(parent: BuiltinTheme, overrides: ThemeOverrides) {
    return {
      overrides: overrides as Prisma.InputJsonValue,
      accessibility: (await this.accessibilityOf(
        parent,
        overrides,
      )) as unknown as Prisma.InputJsonValue,
      fingerprint: await this.fingerprintOf(parent, overrides),
    };
  }

  /**
   * The same theme wherever it is met (docs/themes.md): its parent and its overrides, each
   * file by its bytes' hash rather than by the media that holds it.
   */
  async fingerprintOf(parent: string, overrides: ThemeOverrides): Promise<string> {
    const ids = themeMediaIds(overrides);
    const files = await this.prisma.mediaAsset.findMany({
      where: { id: { in: ids } },
      select: { id: true, blobSha256: true },
    });
    const hashOf = new Map(files.map((f) => [f.id, f.blobSha256 ?? f.id]));
    return themeFingerprint(parent, overrides, (ref) => hashOf.get(ref));
  }

  /** Computed, never declared (docs/themes.md); icons compared by their file. */
  async accessibilityOf(
    parent: BuiltinTheme,
    overrides: ThemeOverrides,
  ): Promise<ThemeAccessibility> {
    const icons = Object.entries(overrides.slots ?? {}).filter(([, s]) => s?.icon);
    const files = icons.length
      ? await this.prisma.mediaAsset.findMany({
          where: { id: { in: icons.map(([, s]) => s!.icon!) } },
          select: { id: true, blobSha256: true },
        })
      : [];
    const prints = Object.fromEntries(
      icons.map(([slot, s]) => [slot, files.find((f) => f.id === s!.icon)?.blobSha256 ?? s!.icon!]),
    );
    return themeAccessibility(mergeTheme(BUILTIN_THEME_VALUES[parent], overrides), prints);
  }

  private toDto(row: ThemeRow, user: User, def: ThemeRef): ThemeDto {
    return {
      id: row.id,
      name: row.name,
      parent: row.parent as BuiltinTheme,
      overrides: themeOverridesInput.parse(row.overrides),
      accessibility: row.accessibility as unknown as ThemeAccessibility,
      owner: { id: row.owner.id, name: row.owner.displayName },
      canEdit: row.ownerId === user.id || isManager(user.roles),
      quizCount: row._count.quizzes,
      isDefault: 'id' in def && def.id === row.id,
      media: Object.fromEntries(
        row.media.map((m) => [m.media.id, { url: m.media.url, name: m.media.name }]),
      ),
      license: row.license,
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}

/**
 * A theme's fingerprint: its parent and overrides, each file by `hashOf` (its bytes'
 * SHA-256) — the same wherever the theme is met, whatever ids or paths name its files.
 */
export function themeFingerprint(
  parent: string,
  overrides: ThemeOverrides,
  hashOf: (ref: string) => string | undefined,
): string {
  const canonical = stableJson({ parent, overrides }, (v) =>
    typeof v === 'string' ? (hashOf(v) ?? v) : v,
  );
  return createHash('sha256').update(canonical).digest('hex');
}

/** JSON with its keys sorted, each value passed through `map` first: one text per value. */
function stableJson(value: unknown, map: (v: unknown) => unknown): string {
  const v = map(value);
  if (Array.isArray(v)) return `[${v.map((x) => stableJson(x, map)).join(',')}]`;
  if (v && typeof v === 'object') {
    const entries = Object.entries(v)
      .filter(([, x]) => x !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : 1));
    return `{${entries.map(([k, x]) => `${JSON.stringify(k)}:${stableJson(x, map)}`).join(',')}}`;
  }
  return JSON.stringify(v);
}
