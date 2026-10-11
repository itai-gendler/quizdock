import { createHash } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import {
  BUILTIN_THEME_VALUES,
  type ThemeOverrides,
  mapThemeRefs,
  mergeTheme,
  themeAccessibility,
  themeMediaIds,
  themeOverridesInput,
} from '@quiz-dock/contracts';
import { strFromU8, strToU8, type Zippable, zipSync } from 'fflate';
import { z } from 'zod';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';
import { archiveLimits, readArchive } from '../quizzes/portable/bundle-archive';
import {
  type BundleMediaMeta,
  bundleMediaMetaSchema,
  mediaPathSchema,
  type ThemeBlock,
  themeBlockSchema,
} from '../quizzes/portable/quiz-bundle.schema';
import { checkFont, sanitiseIcon } from './theme-assets';
import { type ThemeRef, ThemesService, isBuiltin, themeFingerprint } from './themes.service';

/** What a quiz bundle says of its theme (THEMING §3.3). */
export type ThemeExport = 'full' | 'fallback' | 'none';

/** A theme's files in a bundle, by extension (the zip has no mime). */
const AUDIO_EXT: Record<string, string> = { mp3: 'audio/mpeg', m4a: 'audio/mp4' };
const IMAGE_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
};
const EXT_BY_MIME: Record<string, string> = {
  'image/svg+xml': 'svg',
  'font/woff2': 'woff2',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export const THEME_BUNDLE_FORMAT = 'quizdock/theme';
export const THEME_BUNDLE_VERSION = 1;
const THEME_MANIFEST = 'theme.json';

/** A theme bundle's manifest (`theme.json`, THEMING §3.5): the quiz bundle's theme block. */
export const themeBundleSchema = z.object({
  format: z.literal(THEME_BUNDLE_FORMAT),
  version: z.number().int().min(1).max(THEME_BUNDLE_VERSION),
  theme: themeBlockSchema,
  media: z.record(mediaPathSchema, bundleMediaMetaSchema).optional(),
});
export type ThemeBundle = z.infer<typeof themeBundleSchema>;

/** The outcome of reading a theme block: the quiz's theme, and what was given up. */
export interface ImportedTheme {
  ref: ThemeRef | null;
  /** Domain codes said to the importer (`theme.unknown`, `theme.fallback`). */
  warnings: string[];
}

/** A theme's place for each of its files: what it must be, checked by its content. */
type Place = 'image' | 'audio' | 'icon' | 'font';

/**
 * A theme leaving or entering an instance (THEMING §3): as the `theme` block of a quiz
 * bundle, or alone as a theme bundle. Its files travel in the same flat `media/` folder.
 */
@Injectable()
export class ThemePortableService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
    private readonly themes: ThemesService,
  ) {}

  /**
   * A quiz's theme as its bundle carries it: `full` (the theme with its overrides and
   * files), `fallback` (only its parent), `none` (nothing). The files are added to the
   * zip by `addFile`, which returns their path.
   */
  async exportBlock(
    ref: ThemeRef | null,
    mode: ThemeExport,
    addFile: (mediaId: string) => Promise<string | undefined>,
  ): Promise<ThemeBlock | undefined> {
    if (!ref || mode === 'none') return undefined;
    if ('builtin' in ref) return { builtin: ref.builtin };
    const theme = await this.prisma.theme.findUnique({ where: { id: ref.id } });
    if (!theme) return undefined;
    if (mode === 'fallback') return { builtin: theme.parent };
    const overrides = themeOverridesInput.parse(theme.overrides);
    const paths = new Map<string, string>();
    for (const id of themeMediaIds(overrides)) {
      const path = await addFile(id);
      if (path) paths.set(id, path);
    }
    return {
      ...(theme.slug ? { slug: theme.slug } : {}),
      name: theme.name,
      revision: theme.revision,
      license: theme.license,
      parent: theme.parent,
      overrides: mapThemeRefs(overrides, (id) => paths.get(id)) as never,
      accessibility: theme.accessibility,
    };
  }

  /** The path a theme's file takes in a bundle, and its bytes (null: a file gone). */
  async fileOf(
    mediaId: string,
  ): Promise<{ path: string; bytes: Buffer; meta: BundleMediaMeta } | null> {
    const asset = await this.media.readAsset(mediaId);
    if (!asset) return null;
    return {
      path: `media/${mediaId}.${EXT_BY_MIME[asset.mime] ?? 'bin'}`,
      bytes: asset.buffer,
      meta: {
        ...(asset.asset.name ? { name: asset.asset.name } : {}),
        ...(asset.asset.credit ? { credit: asset.asset.credit } : {}),
        ...(asset.asset.kind === 'audio'
          ? {
              durationMs: asset.asset.durationMs ?? undefined,
              peaks: asset.asset.peaks,
              loudnessLufs: asset.asset.loudnessLufs ?? undefined,
              peakDbfs: asset.asset.peakDbfs ?? undefined,
            }
          : {}),
      },
    };
  }

  /**
   * A theme block met at import (THEMING §3.4): a shipped theme by its key; a whole
   * theme reused when the library holds an identical one (same parent, overrides and
   * files), else copied, owned by the importer. A key this instance does not know: its
   * default, said. A file refused: the theme's parent instead, said.
   */
  async importBlock(
    ownerId: string,
    block: ThemeBlock | undefined,
    files: Record<string, Uint8Array>,
    meta: Record<string, BundleMediaMeta> = {},
  ): Promise<ImportedTheme> {
    if (!block) return { ref: null, warnings: [] };
    if ('builtin' in block) {
      return isBuiltin(block.builtin)
        ? { ref: { builtin: block.builtin }, warnings: [] }
        : { ref: null, warnings: ['theme.unknown'] };
    }
    if (!isBuiltin(block.parent)) return { ref: null, warnings: ['theme.unknown'] };
    const parent = block.parent;
    const fallback = { ref: { builtin: parent }, warnings: ['theme.fallback'] };

    // Each file checked for its place, as the bytes it will be stored with.
    const prepared = new Map<string, { place: Place; bytes: Buffer }>();
    try {
      for (const [path, place] of placesOf(block.overrides as ThemeOverrides)) {
        const raw = files[path];
        if (!raw) return fallback;
        const ext = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        let bytes = Buffer.from(raw);
        if (place === 'icon') {
          if (ext !== 'svg') return fallback;
          bytes = Buffer.from(sanitiseIcon(bytes).svg, 'utf8');
        } else if (place === 'font') {
          if (ext !== 'woff2') return fallback;
          checkFont(bytes);
        } else if (!(place === 'image' ? IMAGE_EXT : AUDIO_EXT)[ext]) {
          return fallback;
        }
        prepared.set(path, { place, bytes });
      }
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof PayloadTooLargeException) {
        return fallback;
      }
      throw err;
    }

    // Met before: the same theme, whoever owns it.
    const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
    const fingerprint = themeFingerprint(parent, block.overrides as ThemeOverrides, (ref) => {
      const file = prepared.get(ref);
      return file ? sha(file.bytes) : undefined;
    });
    const same = await this.prisma.theme.findFirst({ where: { fingerprint } });
    if (same) return { ref: { id: same.id }, warnings: [] };

    const idByPath = new Map<string, string>();
    try {
      for (const [path, { place, bytes }] of prepared) {
        const name = meta[path]?.name ?? undefined;
        if (place === 'icon' || place === 'font') {
          idByPath.set(
            path,
            (await this.media.storeThemeAsset(ownerId, bytes, place, name)).mediaId,
          );
          continue;
        }
        const m = meta[path];
        const ext = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        const uploaded = await this.media.upload(
          ownerId,
          {
            buffer: bytes,
            mimetype: (place === 'image' ? IMAGE_EXT : AUDIO_EXT)[ext],
            size: bytes.length,
            originalname: name,
          },
          {
            durationMs: m?.durationMs,
            peaks: m?.peaks ? JSON.stringify(m.peaks) : undefined,
            loudnessLufs: m?.loudnessLufs,
            peakDbfs: m?.peakDbfs,
          },
        );
        if (uploaded.kind !== place) return fallback;
        if (m?.credit) await this.media.setCredit(ownerId, uploaded.mediaId, m.credit);
        idByPath.set(path, uploaded.mediaId);
      }
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof PayloadTooLargeException) {
        return fallback;
      }
      throw err;
    }

    const overrides = themeOverridesInput.parse(
      mapThemeRefs(block.overrides as ThemeOverrides, (path) => idByPath.get(path)),
    );
    const icons = Object.fromEntries(
      Object.entries(overrides.slots ?? {}).flatMap(([slot, s]) => {
        const path = [...idByPath].find(([, id]) => id === s?.icon)?.[0];
        const file = path ? prepared.get(path) : undefined;
        return file ? [[slot, sha(file.bytes)]] : [];
      }),
    );
    const created = await this.prisma.theme.create({
      data: {
        ownerId,
        name: block.name,
        parent,
        slug: block.slug ?? null,
        license: block.license ?? null,
        revision: block.revision ?? 0,
        overrides: overrides as Prisma.InputJsonValue,
        // Recomputed here, never the bundle's word for it.
        accessibility: themeAccessibility(
          mergeTheme(BUILTIN_THEME_VALUES[parent], overrides),
          icons,
        ) as unknown as Prisma.InputJsonValue,
        fingerprint,
        media: { create: themeMediaIds(overrides).map((mediaId) => ({ mediaId })) },
      },
    });
    return { ref: { id: created.id }, warnings: [] };
  }

  /** A theme alone, zipped (THEMING §3.5): `theme.json` + `media/`. */
  async exportZip(themeId: string): Promise<{ filename: string; zip: Buffer }> {
    const theme = await this.prisma.theme.findUnique({ where: { id: themeId } });
    if (!theme) throw new NotFoundException('theme.not_found');
    const files: Zippable = {};
    const media: Record<string, BundleMediaMeta> = {};
    const block = await this.exportBlock({ id: themeId }, 'full', async (id) => {
      const file = await this.fileOf(id);
      if (!file) return undefined;
      files[file.path] = [new Uint8Array(file.bytes), { level: 0 }];
      if (Object.keys(file.meta).length) media[file.path] = file.meta;
      return file.path;
    });
    const manifest: ThemeBundle = {
      format: THEME_BUNDLE_FORMAT,
      version: THEME_BUNDLE_VERSION,
      theme: block as ThemeBlock,
      ...(Object.keys(media).length ? { media } : {}),
    };
    files[THEME_MANIFEST] = strToU8(JSON.stringify(manifest, null, 2));
    const slug = theme.slug ?? slugOfName(theme.name);
    return {
      filename: `${slug}.quizdock-theme.zip`,
      zip: Buffer.from(zipSync(files, { level: 6 })),
    };
  }

  /** A theme bundle into the library: reused when already there, else copied. */
  async importZip(
    ownerId: string,
    file: { buffer: Buffer } | undefined,
  ): Promise<{ themeId: string | null; warnings: string[] }> {
    if (!file) throw new BadRequestException('import.file_missing');
    const files = readArchive(
      new Uint8Array(file.buffer),
      (name) => name === THEME_MANIFEST || /^media\/[^/]+$/.test(name),
      archiveLimits(this.media.maxUploadBytes),
    );
    const raw = files[THEME_MANIFEST];
    if (!raw) throw new BadRequestException('import.invalid_bundle');
    let json: unknown;
    try {
      json = JSON.parse(strFromU8(raw));
    } catch {
      throw new BadRequestException('import.invalid_bundle');
    }
    const parsed = themeBundleSchema.safeParse(json);
    if (!parsed.success) {
      throw new BadRequestException({
        code: 'import.invalid_bundle',
        params: { field: parsed.error.issues[0]?.path.join('.') || '_' },
      });
    }
    if ('builtin' in parsed.data.theme) throw new BadRequestException('import.invalid_bundle');
    const imported = await this.importBlock(
      ownerId,
      parsed.data.theme,
      files,
      parsed.data.media ?? {},
    );
    // A theme bundle that cannot become a theme of the library brings nothing.
    if (!imported.ref || !('id' in imported.ref)) {
      throw new BadRequestException(imported.warnings[0] ?? 'import.invalid_bundle');
    }
    return { themeId: imported.ref.id, warnings: imported.warnings };
  }
}

/** Each file a theme block points to, with the place it fills. */
function placesOf(overrides: ThemeOverrides) {
  const places = new Map<string, Place>();
  if (overrides.background?.image) places.set(overrides.background.image, 'image');
  for (const slot of Object.values(overrides.slots ?? {}))
    if (slot?.icon) places.set(slot.icon, 'icon');
  if (overrides.font && 'file' in overrides.font) places.set(overrides.font.file, 'font');
  for (const path of Object.values(overrides.sounds ?? {})) if (path) places.set(path, 'audio');
  return places;
}

/** A file name from a theme's name, for one that never had a slug. */
function slugOfName(name: string): string {
  return (
    name
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'theme'
  );
}
