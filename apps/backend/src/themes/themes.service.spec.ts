import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { User } from '@prisma/client';
import { BUILTIN_THEME_VALUES } from '@quiz-dock/contracts';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RedisService } from '../redis/redis.service';
import { DEFAULT_THEME_KEY, ThemesService } from './themes.service';

/** The library of quiz themes (docs/themes.md), on the test database. */
describe('ThemesService (integration)', () => {
  let prisma: PrismaService;
  let media: MediaService;
  let themes: ThemesService;
  let dir: string;
  let owner: User;
  let other: User;
  let admin: User;
  const env = process.env;
  const redis = { scanKeys: jest.fn(async () => [] as string[]) } as unknown as RedisService;
  // Its own viewBox: identical files share a stored blob, and the suites run in parallel.
  const icon = (d: string) =>
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.02 24.02"><path d="${d}"/></svg>`,
    );
  const code = async (p: Promise<unknown>) =>
    p.then(
      () => null,
      (e: { getResponse(): { code?: string; message?: string } }) =>
        e.getResponse().code ?? e.getResponse().message,
    );

  beforeAll(async () => {
    if (!env.DATABASE_URL?.includes('_test')) {
      throw new Error('DATABASE_URL must point at a test database (see test/jest.global-setup.ts)');
    }
    prisma = new PrismaService();
    await prisma.$connect();
    const make = (slug: string, roles: ('host' | 'admin')[]) =>
      prisma.user.upsert({
        where: { oidcSubject: `local:${slug}` },
        create: { oidcSubject: `local:${slug}`, displayName: slug, roles },
        update: {},
      });
    owner = await make('themes-owner', ['host']);
    other = await make('themes-other', ['host']);
    admin = await make('themes-admin', ['admin']);
  });

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'themes-'));
    process.env = { ...env, MEDIA_DIR: dir };
    media = new MediaService(prisma, redis);
    themes = new ThemesService(prisma, media);
  });

  afterEach(async () => {
    process.env = env;
    const ids = [owner.id, other.id, admin.id];
    await prisma.quiz.deleteMany({ where: { ownerId: { in: ids } } });
    await prisma.theme.deleteMany({ where: { ownerId: { in: ids } } });
    await prisma.instanceSetting.deleteMany({ where: { key: DEFAULT_THEME_KEY } });
    const assets = await prisma.mediaAsset.findMany({
      where: { ownerId: { in: ids } },
      select: { blobSha256: true },
    });
    await prisma.mediaAsset.deleteMany({ where: { ownerId: { in: ids } } });
    const shas = assets.map((a) => a.blobSha256).filter((s): s is string => !!s);
    // Only the blobs nothing holds any more: another suite may share one.
    await prisma.mediaBlob.deleteMany({ where: { sha256: { in: shas }, assets: { none: {} } } });
    await rm(dir, { recursive: true, force: true });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates a child theme that stores what it overrides, with its accessibility', async () => {
    const t = await themes.create(owner, {
      name: 'Orange',
      parent: 'night',
      overrides: { accent: '#ff6a00' },
    });
    expect(t).toMatchObject({
      name: 'Orange',
      parent: 'night',
      overrides: { accent: '#ff6a00' },
      canEdit: true,
      quizCount: 0,
      owner: { id: owner.id, name: 'themes-owner' },
    });
    expect(t.accessibility.status).toBeDefined();
    const row = await prisma.theme.findUniqueOrThrow({ where: { id: t.id } });
    expect(row.fingerprint).toMatch(/^[0-9a-f]{64}$/);
  });

  it('lets every host use a theme, and only its owner or an admin edit it', async () => {
    const t = await themes.create(owner, { name: 'Mine', parent: 'classic', overrides: {} });
    const seen = (await themes.list(other)).themes.find((x) => x.id === t.id);
    expect(seen?.canEdit).toBe(false);
    expect(await code(themes.update(other, t.id, { name: 'Hijacked' }))).toBe('theme.not_owner');
    expect(await code(themes.remove(other, t.id))).toBe('theme.not_owner');
    expect((await themes.update(admin, t.id, { name: 'Renamed' })).name).toBe('Renamed');
  });

  it('carries the licence its owner gives it, for an export a store accepts', async () => {
    const t = await themes.create(owner, { name: 'Shared', parent: 'classic', overrides: {} });
    expect(t.license).toBeNull();
    expect((await themes.update(owner, t.id, { license: 'CC-BY-4.0' })).license).toBe('CC-BY-4.0');
    expect((await themes.update(owner, t.id, { name: 'Shared!' })).license).toBe('CC-BY-4.0');
    expect((await themes.update(owner, t.id, { license: null })).license).toBeNull();
  });

  it('takes an icon uploaded for it, sanitised, and compares icons by their file', async () => {
    const a = await themes.uploadAsset(owner, 'icon', { buffer: icon('M0 0H24V24Z') });
    const b = await themes.uploadAsset(owner, 'icon', { buffer: icon('M0 0H24V24Z') });
    expect(a.strokeRemoved).toBe(false);
    const t = await themes.create(owner, {
      name: 'Twins',
      parent: 'classic',
      overrides: {
        slots: {
          red: { color: '#e7000b', icon: a.mediaId },
          blue: { color: '#155dfc', icon: b.mediaId },
        },
      },
    });
    expect(Object.keys(t.media).sort()).toEqual([a.mediaId, b.mediaId].sort());
    const twins = t.accessibility.checks.find((c) => c.code === 'icons_distinct');
    expect(twins).toMatchObject({ passed: false, slots: ['red', 'blue'] });
    // Held by the theme: neither swept nor deleted.
    expect(await code(media.remove(owner.id, a.mediaId))).toBe('media.in_use');
  });

  it('refuses a file of the wrong kind, or another host’s', async () => {
    const mine = await themes.uploadAsset(owner, 'icon', { buffer: icon('M0 0H1') });
    expect(
      await code(
        themes.create(owner, {
          name: 'X',
          parent: 'classic',
          overrides: { sounds: { gong: mine.mediaId } },
        }),
      ),
    ).toBe('theme.invalid_media');
    expect(
      await code(
        themes.create(other, {
          name: 'X',
          parent: 'classic',
          overrides: { slots: { red: { color: '#ff0000', icon: mine.mediaId } } },
        }),
      ),
    ).toBe('theme.invalid_media');
  });

  it('cannot be deleted while a quiz uses it or it is the default', async () => {
    const t = await themes.create(owner, { name: 'Used', parent: 'classic', overrides: {} });
    const quiz = await prisma.quiz.create({
      data: { ownerId: other.id, title: 'Q', themeId: t.id },
    });
    expect(await code(themes.remove(owner, t.id))).toBe('theme.in_use');
    expect((await themes.get(owner, t.id)).quizCount).toBe(1);
    await prisma.quiz.delete({ where: { id: quiz.id } });
    await themes.setDefault(admin, { id: t.id });
    expect(await code(themes.remove(owner, t.id))).toBe('theme.is_default');
    await themes.setDefault(admin, { builtin: 'classic' });
    await themes.remove(owner, t.id);
    expect(await prisma.theme.count({ where: { id: t.id } })).toBe(0);
  });

  it('lets only an admin set the default', async () => {
    expect(await code(themes.setDefault(owner, { builtin: 'night' }))).toBe('auth.admin_required');
    expect((await themes.setDefault(admin, { builtin: 'night' })).defaultTheme).toEqual({
      builtin: 'night',
    });
  });

  it('resolves a quiz’s theme, else the default, else Classic', async () => {
    const t = await themes.create(owner, {
      name: 'R',
      parent: 'festive',
      overrides: { accent: '#123456' },
    });
    expect((await themes.resolve({ id: t.id })).values).toMatchObject({
      accent: '#123456',
      motion: BUILTIN_THEME_VALUES.festive.motion,
    });
    expect((await themes.resolve(null)).values).toBe(BUILTIN_THEME_VALUES.classic);
    await themes.setDefault(admin, { builtin: 'night' });
    expect((await themes.resolve(null)).values).toBe(BUILTIN_THEME_VALUES.night);
    expect((await themes.resolve({ id: '0'.repeat(26) })).values).toBe(BUILTIN_THEME_VALUES.night);
  });

  it('duplicates any theme as the caller’s own', async () => {
    const t = await themes.create(owner, {
      name: 'Src',
      parent: 'kids',
      overrides: { accent: '#000000' },
    });
    const copy = await themes.duplicate(other, t.id, 'Copy');
    expect(copy).toMatchObject({
      name: 'Copy',
      parent: 'kids',
      canEdit: true,
      owner: { id: other.id },
    });
    expect(copy.overrides).toEqual(t.overrides);
  });
});
