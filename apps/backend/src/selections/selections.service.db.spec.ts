import type { GameService } from '../game/game.service';
import { PrismaService } from '../prisma/prisma.service';
import { SelectionsService } from './selections.service';

/**
 * Against the test database (SPECIFICATIONS-SELECTION): everyone sees of a selection
 * what they may read, the owner alone changes it, and nothing hidden is lost.
 */
describe('SelectionsService (integration)', () => {
  let prisma: PrismaService;
  let service: SelectionsService;
  const game = { getRoom: jest.fn(), playedOrder: jest.fn() };
  let ann: string;
  let bob: string;
  const stamp = Date.now();

  const quiz = (ownerId: string, title: string, over: Record<string, unknown> = {}) =>
    prisma.quiz.create({
      data: { ownerId, title, status: 'ready', questionCount: 1, ...over },
    });

  beforeAll(async () => {
    if (!process.env.DATABASE_URL?.includes('_test')) {
      throw new Error('DATABASE_URL must point at a test database (see test/jest.global-setup.ts)');
    }
    prisma = new PrismaService();
    service = new SelectionsService(prisma, game as unknown as GameService);
    const user = (name: string) =>
      prisma.user.create({
        data: { oidcSubject: `local:sel-${name}-${stamp}`, displayName: name, roles: ['host'] },
      });
    ann = (await user('Ann')).id;
    bob = (await user('Bob')).id;
  });

  afterAll(async () => {
    await prisma.selection.deleteMany({ where: { ownerId: { in: [ann, bob] } } });
    await prisma.gameSessionLog.deleteMany({ where: { hostId: { in: [ann, bob] } } });
    await prisma.quiz.deleteMany({ where: { ownerId: { in: [ann, bob] } } });
    await prisma.user.deleteMany({ where: { id: { in: [ann, bob] } } });
    await prisma.$disconnect();
  });

  const items = (...ids: string[]) =>
    ids.map((quizId) => ({ quizId, mode: 'manual' as const, autoStart: true }));

  it('another host sees only what they may read; one with nothing readable does not show', async () => {
    const shared = await quiz(ann, 'Shared', { shared: true });
    const mine = await quiz(ann, 'Private');
    const draft = await quiz(ann, 'Shared draft', { shared: true, status: 'draft' });
    const s = await service.create(ann, { name: 'Mixed' });
    await service.update(ann, s.id, {
      shared: true,
      items: items(shared.id, mine.id, draft.id),
    });
    const hidden = await service.create(ann, { name: 'All private' });
    await service.update(ann, hidden.id, { shared: true, items: items(mine.id) });

    const forBob = await service.get(bob, s.id);
    expect(forBob.items.map((i) => i.title)).toEqual(['Shared', 'Shared draft']);
    expect(forBob.items[1].unplayable).toBe('draft');
    expect(forBob).toMatchObject({
      editable: false,
      ownerName: 'Ann',
      quizCount: 2,
      playableCount: 1,
    });
    expect(forBob.unsharedCount).toBeUndefined();
    const listed = (await service.list(bob)).map((x) => x.id);
    expect(listed).toContain(s.id);
    expect(listed).not.toContain(hidden.id);
    await expect(service.get(bob, hidden.id)).rejects.toMatchObject({
      response: { message: 'selection.not_found' },
    });
    // The owner is told what the others will not see.
    expect((await service.get(ann, s.id)).unsharedCount).toBe(1);
    // And only the owner changes it.
    await expect(service.update(bob, s.id, { name: 'Mine now' })).rejects.toMatchObject({
      response: { message: 'selection.not_found' },
    });
  });

  it('a deleted quiz leaves the list; a quiz no longer shared keeps its place unseen', async () => {
    const theirs = await quiz(bob, 'Bob’s', { shared: true });
    const a = await quiz(ann, 'A');
    const b = await quiz(ann, 'B');
    const s = await service.create(ann, { name: 'Order' });
    await service.update(ann, s.id, { items: items(a.id, theirs.id, b.id) });

    // Bob stops sharing: Ann no longer sees it, and reordering what she sees keeps it.
    await prisma.quiz.update({ where: { id: theirs.id }, data: { shared: false } });
    const seen = await service.update(ann, s.id, { items: items(b.id, a.id) });
    expect(seen.items.map((i) => i.title)).toEqual(['B', 'A']);
    const all = await prisma.selectionItem.findMany({
      where: { selectionId: s.id },
      orderBy: { orderIndex: 'asc' },
    });
    expect(all.map((i) => i.quizId)).toEqual([b.id, a.id, theirs.id]);

    // Shared again, it shows where it stayed; deleted, it is gone.
    await prisma.quiz.update({ where: { id: theirs.id }, data: { shared: true } });
    expect((await service.get(ann, s.id)).items.map((i) => i.title)).toEqual(['B', 'A', 'Bob’s']);
    await prisma.quiz.delete({ where: { id: theirs.id } });
    expect((await service.get(ann, s.id)).items).toHaveLength(2);
  });

  it('refuses a quiz twice, one the owner cannot read, and more than 50', async () => {
    const a = await quiz(ann, 'Twice');
    const other = await quiz(bob, 'Not shared');
    const s = await service.create(ann, { name: 'Limits' });
    await expect(service.update(ann, s.id, { items: items(a.id, a.id) })).rejects.toMatchObject({
      response: { message: 'selection.duplicate_quiz' },
    });
    await expect(service.update(ann, s.id, { items: items(other.id) })).rejects.toMatchObject({
      response: { message: 'selection.quiz_not_found' },
    });
    const many = await Promise.all(Array.from({ length: 51 }, (_, i) => quiz(ann, `Q${i}`)));
    await expect(
      service.update(ann, s.id, { items: items(...many.map((q) => q.id)) }),
    ).rejects.toMatchObject({ response: { message: 'selection.too_many_quizzes' } });
  });

  it('creating from a shared selection refers to the same quizzes, those the taker may read', async () => {
    const shared = await quiz(ann, 'Kept', { shared: true });
    const mine = await quiz(ann, 'Left out');
    const s = await service.create(ann, { name: 'Source' });
    await service.update(ann, s.id, { shared: true, items: items(shared.id, mine.id) });
    const copy = await service.duplicate(bob, s.id);
    expect(copy).toMatchObject({ editable: true, name: 'Source', shared: false });
    expect(copy.items.map((i) => i.quizId)).toEqual([shared.id]);
    expect(await prisma.quiz.count({ where: { ownerId: bob, title: 'Kept' } })).toBe(0); // no copy of the quiz
  });

  it('saves a room as a selection, live or from its archive, leaving out what cannot be read', async () => {
    const a = await quiz(ann, 'Played first');
    const b = await quiz(ann, 'Played second');
    const other = await quiz(bob, 'Not readable');
    game.getRoom.mockResolvedValue({ hostUserId: ann, name: 'Thursday' });
    game.playedOrder.mockResolvedValue([
      { quizId: a.id, mode: 'auto' },
      { quizId: other.id, mode: 'manual' },
      { quizId: b.id, mode: 'manual' },
    ]);
    const live = await service.fromRoom(ann, { pin: '123456' });
    expect(live.name).toBe('Thursday');
    expect(live.items.map((i) => [i.quizId, i.mode])).toEqual([
      [a.id, 'auto'],
      [b.id, 'manual'],
    ]);
    game.getRoom.mockResolvedValue({ hostUserId: bob, name: '' });
    await expect(service.fromRoom(ann, { pin: '123456' })).rejects.toMatchObject({
      response: { message: 'session.not_found' },
    });

    const roomId = `room-${stamp}`;
    const session = (quizId: string, at: number) =>
      prisma.gameSessionLog.create({
        data: {
          quizId,
          hostId: ann,
          pin: '123456',
          roomId,
          roomName: 'Archived night',
          language: 'fr',
          startedAt: new Date(at),
          endedAt: new Date(at + 1000),
          retainUntil: new Date(at + 86_400_000),
        },
      });
    await session(b.id, 1000);
    await session(a.id, 2000);
    const archived = await service.fromRoom(ann, { roomId });
    expect(archived.name).toBe('Archived night');
    expect(archived.items.map((i) => [i.quizId, i.mode])).toEqual([
      [b.id, 'manual'],
      [a.id, 'manual'],
    ]);
  });

  it('compares its launches by its owner, from their archived sessions', async () => {
    const a = await quiz(ann, 'Launched');
    const s = await service.create(ann, { name: 'Launches' });
    await service.update(ann, s.id, { items: items(a.id) });
    for (const [room, rate, at] of [
      ['r1', 0.5, 1000],
      ['r2', 0.8, 5000],
    ] as const) {
      await prisma.gameSessionLog.create({
        data: {
          quizId: a.id,
          hostId: ann,
          pin: '654321',
          roomId: `${room}-${stamp}`,
          selectionId: s.id,
          language: 'fr',
          playerCount: 12,
          successRate: rate,
          startedAt: new Date(at),
          endedAt: new Date(at + 1000),
          retainUntil: new Date(at + 86_400_000),
        },
      });
    }
    const launches = await service.launches(ann, s.id);
    expect(launches.map((l) => l.sessions[0].successRate)).toEqual([0.8, 0.5]); // newest first
    expect(launches[0]).toMatchObject({ participants: 12 });
    // Deleting the selection keeps the sessions, emptied of it.
    await service.remove(ann, s.id);
    expect(await prisma.gameSessionLog.count({ where: { quizId: a.id, selectionId: null } })).toBe(
      2,
    );
  });
});
