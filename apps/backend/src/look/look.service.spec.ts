import type { User } from '@prisma/client';
import { DEFAULT_LOOK } from '@quiz-dock/contracts';
import { PrismaService } from '../prisma/prisma.service';
import { LOOK_KEY, LookService } from './look.service';

/** The instance's look (docs/themes.md), on the test database. */
describe('LookService (integration)', () => {
  let prisma: PrismaService;
  let look: LookService;
  let admin: User;
  const author = { name: 'look-admin' };
  const code = async (p: Promise<unknown>) =>
    p.then(
      () => null,
      (e: { code?: string }) => e.code,
    );
  const media = (kind: 'image' | 'audio') =>
    prisma.mediaAsset.create({
      data: { ownerId: admin.id, url: 'x', mime: 'image/png', sizeBytes: 1n, kind },
    });

  beforeAll(async () => {
    if (!process.env.DATABASE_URL?.includes('_test')) {
      throw new Error('DATABASE_URL must point at a test database (see test/jest.global-setup.ts)');
    }
    prisma = new PrismaService();
    await prisma.$connect();
    admin = await prisma.user.upsert({
      where: { oidcSubject: 'local:look-admin' },
      create: { oidcSubject: 'local:look-admin', displayName: 'look-admin', roles: ['admin'] },
      update: {},
    });
    look = new LookService(prisma);
  });

  beforeEach(() => prisma.instanceSetting.deleteMany({ where: { key: LOOK_KEY } }));
  afterAll(() => prisma.$disconnect());

  it('is QuizDock’s own until an administrator sets one, and back to it on reset', async () => {
    expect(await look.get()).toEqual(DEFAULT_LOOK);
    await look.set(author, { ...DEFAULT_LOOK, primary: '#7c3aed', radius: 'rounded' });
    expect(await look.get()).toMatchObject({ primary: '#7c3aed', radius: 'rounded' });
    const resolved = await look.resolved();
    expect(resolved.linkDark).toMatch(/^#[0-9a-f]{6}$/);
    await look.reset();
    expect(await look.get()).toEqual(DEFAULT_LOOK);
  });

  it('refuses a malformed look, and a picture that is not an image', async () => {
    expect(await code(look.set(author, { ...DEFAULT_LOOK, primary: 'blue' }))).toBe(
      'invalid_params',
    );
    const sound = await media('audio');
    const showcase = {
      ...DEFAULT_LOOK.showcase,
      mode: 'picture',
      picture: { image: sound.id, style: { mode: 'cover' } },
    };
    expect(await code(look.set(author, { ...DEFAULT_LOOK, showcase }))).toBe('invalid_params');
  });

  it('makes its picture one of the instance’s media, never swept', async () => {
    const picture = await media('image');
    const showcase = {
      ...DEFAULT_LOOK.showcase,
      mode: 'picture' as const,
      picture: { image: picture.id, style: { mode: 'cover' as const } },
    };
    const parsed = await code(look.set(author, { ...DEFAULT_LOOK, showcase }));
    expect(parsed).toBeNull();
    expect((await prisma.mediaAsset.findUnique({ where: { id: picture.id } }))?.instance).toBe(
      true,
    );
    expect((await look.resolved()).pictureUrl).toContain(picture.id);
  });
});
