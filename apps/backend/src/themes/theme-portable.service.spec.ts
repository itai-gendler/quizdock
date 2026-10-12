import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { User } from '@prisma/client';
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';
import { QuizPortableService } from '../quizzes/portable/quiz-portable.service';
import type { RedisService } from '../redis/redis.service';
import { ThemePortableService } from './theme-portable.service';
import { ThemesService } from './themes.service';

/** Themes in bundles (docs/themes.md): the quiz bundle's theme block, and the theme bundle. */
describe('ThemePortableService (integration)', () => {
  let prisma: PrismaService;
  let media: MediaService;
  let themes: ThemesService;
  let portable: ThemePortableService;
  let quizzes: QuizPortableService;
  let dir: string;
  let owner: User;
  let other: User;
  const env = process.env;
  const redis = { scanKeys: jest.fn(async () => [] as string[]) } as unknown as RedisService;
  const icon = (d: string) =>
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${d}"/></svg>`,
    );
  const question = (over: Record<string, unknown> = {}) => ({
    kind: 'question',
    type: 'true_false',
    prompt: 'Sure?',
    options: [
      { text: 'True', color: 'green', shape: 'square', isCorrect: true },
      { text: 'False', color: 'red', shape: 'triangle' },
    ],
    ...over,
  });
  const bundle = (over: Record<string, unknown> = {}, items = [question()]) => ({
    format: 'quizdock/quiz',
    version: 8,
    quiz: { title: 'Themed', language: 'en' },
    items,
    ...over,
  });
  const zipOf = (json: unknown, files: Record<string, Uint8Array> = {}) =>
    Buffer.from(zipSync({ 'quiz.json': strToU8(JSON.stringify(json)), ...files }));
  const manifestOf = (zip: Buffer, name = 'quiz.json') => {
    const files = unzipSync(new Uint8Array(zip));
    return { json: JSON.parse(strFromU8(files[name])), files };
  };
  const importQuiz = (user: User, zip: Buffer) =>
    quizzes.importBundle(user.id, { buffer: zip, mimetype: 'application/zip' });

  beforeAll(async () => {
    if (!env.DATABASE_URL?.includes('_test')) {
      throw new Error('DATABASE_URL must point at a test database (see test/jest.global-setup.ts)');
    }
    prisma = new PrismaService();
    await prisma.$connect();
    const make = (slug: string) =>
      prisma.user.upsert({
        where: { oidcSubject: `local:${slug}` },
        create: { oidcSubject: `local:${slug}`, displayName: slug, roles: ['host'] },
        update: {},
      });
    owner = await make('theme-portable-owner');
    other = await make('theme-portable-other');
  });

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'theme-portable-'));
    process.env = { ...env, MEDIA_DIR: dir };
    media = new MediaService(prisma, redis);
    themes = new ThemesService(prisma, media);
    portable = new ThemePortableService(prisma, media, themes);
    quizzes = new QuizPortableService(prisma, media, portable);
  });

  afterEach(async () => {
    process.env = env;
    const ids = [owner.id, other.id];
    await prisma.quiz.deleteMany({ where: { ownerId: { in: ids } } });
    await prisma.theme.deleteMany({ where: { ownerId: { in: ids } } });
    const assets = await prisma.mediaAsset.findMany({
      where: { ownerId: { in: ids } },
      select: { blobSha256: true },
    });
    await prisma.mediaAsset.deleteMany({ where: { ownerId: { in: ids } } });
    const shas = assets.map((a) => a.blobSha256).filter((s): s is string => !!s);
    await prisma.mediaBlob.deleteMany({ where: { sha256: { in: shas } } });
    await rm(dir, { recursive: true, force: true });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  /** A theme of `owner` with an icon, and a quiz of theirs that uses it. */
  async function themedQuiz() {
    const up = await themes.uploadAsset(owner, 'icon', { buffer: icon('M0 0H24V24Z') });
    const theme = await themes.create(owner, {
      name: 'Pumpkins',
      parent: 'festive',
      overrides: { accent: '#ff6a00', slots: { red: { color: '#ff6a00', icon: up.mediaId } } },
    });
    const quiz = await importQuiz(owner, zipOf(bundle()));
    await prisma.quiz.update({ where: { id: quiz.id }, data: { themeId: theme.id } });
    return { theme, quiz };
  }

  it('exports the whole theme with its files, and an identical one is reused at import', async () => {
    const { theme, quiz } = await themedQuiz();
    const { zip } = await quizzes.exportZip(quiz.id, owner.id, 'full');
    const { json, files } = manifestOf(zip);
    expect(json.version).toBe(8);
    expect(json.theme).toMatchObject({ name: 'Pumpkins', parent: 'festive' });
    const path = json.theme.overrides.slots.red.icon as string;
    expect(path).toMatch(/^media\/\w+\.svg$/);
    expect(files[path]).toBeDefined();

    const copy = await importQuiz(other, zip);
    expect(copy.themeId).toBe(theme.id);
    expect(copy.importWarnings).toBeUndefined();
  });

  it('copies a theme met for the first time, owned by the importer, its icon sanitised', async () => {
    const zip = zipOf(
      bundle({
        theme: {
          name: 'Bats',
          parent: 'night',
          overrides: { slots: { blue: { color: '#ffdd00', icon: 'media/bat.svg' } } },
          accessibility: { status: 'compliant', checks: [] },
        },
      }),
      { 'media/bat.svg': new Uint8Array(icon('M1 1H23V23Z" onclick="x')) },
    );
    const quiz = await importQuiz(other, zip);
    const theme = await prisma.theme.findUniqueOrThrow({
      where: { id: quiz.themeId! },
      include: { media: { include: { media: true } } },
    });
    expect(theme).toMatchObject({ ownerId: other.id, name: 'Bats', parent: 'night' });
    expect(theme.media[0].media.kind).toBe('icon');
    // Recomputed, never the bundle's word: white text on a yellow answer.
    expect((theme.accessibility as { status: string }).status).not.toBe('compliant');
  });

  it('falls back to the parent when a file cannot be used, and says so', async () => {
    const quiz = await importQuiz(
      other,
      zipOf(
        bundle({
          theme: {
            name: 'Broken',
            parent: 'kids',
            overrides: { slots: { red: { color: '#ff0000', icon: 'media/missing.svg' } } },
          },
        }),
      ),
    );
    expect(quiz).toMatchObject({ themeId: null, themeBuiltin: 'kids' });
    expect(quiz.importWarnings).toEqual(['theme.fallback']);
  });

  it('takes a shipped theme by its key, and an unknown key as the default', async () => {
    expect(
      await importQuiz(other, zipOf(bundle({ theme: { builtin: 'halloween' } }))),
    ).toMatchObject({ themeBuiltin: 'halloween', themeId: null });
    const unknown = await importQuiz(other, zipOf(bundle({ theme: { builtin: 'vaporwave' } })));
    expect(unknown).toMatchObject({ themeBuiltin: null, themeId: null });
    expect(unknown.importWarnings).toEqual(['theme.unknown']);
  });

  it('exports only the parent, or nothing, when asked', async () => {
    const { quiz } = await themedQuiz();
    const fallback = manifestOf((await quizzes.exportZip(quiz.id, owner.id, 'fallback')).zip);
    expect(fallback.json.theme).toEqual({ builtin: 'festive' });
    expect(Object.keys(fallback.files).some((f) => f.endsWith('.svg'))).toBe(false);
    const none = manifestOf((await quizzes.exportZip(quiz.id, owner.id, 'none')).zip);
    expect(none.json.theme).toBeUndefined();
    expect(none.json.version).toBeLessThan(8);
  });

  it('carries a step background laid by its style, or degrades it for an older instance', async () => {
    const styled = question({
      background: {
        gradient: { angle: 90, colors: ['#000000', '#ffffff'] },
        mode: 'cover',
        blur: 4,
        textTone: 'dark',
      },
    });
    const quiz = await importQuiz(owner, zipOf(bundle({}, [styled])));
    const row = await prisma.question.findFirstOrThrow({ where: { quizId: quiz.id } });
    expect(row).toMatchObject({ backgroundStyle: { mode: 'cover', blur: 4 }, textTone: 'dark' });

    const v8 = manifestOf((await quizzes.exportZip(quiz.id, owner.id)).zip).json;
    expect(v8.version).toBe(8);
    expect(v8.items[0].background).toMatchObject({ mode: 'cover', blur: 4, textTone: 'dark' });
    expect(v8.items[0].backgroundGradient).toBeUndefined();

    const old = manifestOf((await quizzes.exportZip(quiz.id, owner.id, 'none')).zip).json;
    expect(old.items[0].background).toBeUndefined();
    expect(old.items[0]).toMatchObject({
      backgroundGradient: { angle: 90, colors: ['#000000', '#ffffff'] },
      textTone: 'dark',
    });
  });

  it('round-trips a theme alone as a theme bundle', async () => {
    const { theme } = await themedQuiz();
    const { filename, zip } = await portable.exportZip(theme.id);
    expect(filename).toBe('pumpkins.quizdock-theme.zip');
    const { json } = manifestOf(zip, 'theme.json');
    expect(json).toMatchObject({
      format: 'quizdock/theme',
      version: 1,
      theme: { name: 'Pumpkins' },
    });
    // Already in the library: reused.
    expect((await portable.importZip(other.id, { buffer: zip })).themeId).toBe(theme.id);
  });
});
