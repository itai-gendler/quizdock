import type { RoomSelectionPayload } from '@quiz-dock/contracts';
import type { Socket } from 'socket.io-client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { type GameContext, nextEvent, settle } from '../game-harness';

type QuestionStart = { startedAt: number; options: Array<{ id: string; text: string }> };

/**
 * A room opened from a selection (SPECIFICATIONS-SELECTION): its lobby picks the next
 * quiz of the list not played yet, the host free to change it; its sessions carry it.
 */
export function selectionTests(ctx: GameContext): void {
  let prisma: PrismaService;
  const selections: string[] = [];
  beforeAll(() => {
    prisma = ctx.h.prisma;
  });
  afterAll(async () => {
    await prisma.selection.deleteMany({ where: { id: { in: selections } } });
  });

  /** A selection of the host's, on `quizIds` in that order. */
  async function selectionOf(
    quizIds: string[],
    over: { mode?: 'manual' | 'auto'; autoStart?: boolean } = {},
  ) {
    const s = await prisma.selection.create({
      data: {
        ownerId: ctx.h.hostUserId,
        name: 'Friday night',
        items: {
          create: quizIds.map((quizId, orderIndex) => ({
            quizId,
            orderIndex,
            mode: over.mode ?? 'manual',
            autoStart: over.autoStart ?? false,
          })),
        },
      },
    });
    selections.push(s.id);
    return s.id;
  }

  /** Plays the current one-question quiz to its podium. */
  async function toPodium(host: Socket, pin: string, player: Socket) {
    const start = nextEvent<QuestionStart>(player, 'question:start');
    const reveal = nextEvent(player, 'question:reveal');
    host.emit('host:start', { pin });
    const q = await start;
    await settle(Math.max(0, q.startedAt - Date.now()) + 50);
    player.emit('player:submit', {
      pin,
      questionIndex: 0,
      answer: q.options.find((o) => o.text === 'Paris')!.id,
    });
    await reveal;
    const podium = nextEvent(player, 'game:podium');
    host.emit('host:next', { pin });
    await podium;
  }

  it('opens on its first playable quiz, then the lobby picks the next one not played', async () => {
    const draft = await ctx.h.seedQuiz({ title: 'Draft', status: 'draft' });
    const first = await ctx.h.seedQuiz({ title: 'First' });
    const second = await ctx.h.seedQuiz({ title: 'Second' });
    const id = await selectionOf([draft.id, first.id, second.id], { mode: 'auto' });

    const host = ctx.h.connectHost();
    const shown = nextEvent<RoomSelectionPayload | null>(host, 'room:selection');
    const outline = nextEvent<{ quizId: string }>(host, 'game:outline');
    const { pin } = await host.emitWithAck('host:create', { selectionId: id });
    await host.emitWithAck('host:attach', { pin });
    expect((await outline).quizId).toBe(first.id); // the draft skipped
    expect(await shown).toEqual({
      id,
      name: 'Friday night',
      items: [
        { quizId: first.id, title: 'First', played: false },
        { quizId: second.id, title: 'Second', played: false },
      ],
      nextQuizId: first.id,
    });
    const mode = nextEvent<{ mode: string }>(host, 'game:mode');
    host.emit('host:attach', { pin });
    expect((await mode).mode).toBe('auto'); // the pace the selection gives it

    const { socket: player } = await ctx.h.join(pin, 'Sam');
    await toPodium(host, pin, player);
    const next = nextEvent<{ quizId: string }>(host, 'game:outline', {
      where: (o) => o.quizId !== '',
    });
    const after = nextEvent<RoomSelectionPayload>(host, 'room:selection', {
      where: (p) => p?.nextQuizId === second.id,
    });
    await host.emitWithAck('host:back-to-lobby', { pin, archive: true });
    expect((await next).quizId).toBe(second.id);
    expect((await after).items[0].played).toBe(true);

    // The owner's launch: its sessions carry the selection.
    const kept = await prisma.gameSessionLog.findFirst({ where: { quizId: first.id } });
    expect(kept?.selectionId).toBe(id);
  }, 30_000);

  it('a quiz picked outside the list leaves the queue where it was', async () => {
    const first = await ctx.h.seedQuiz({ title: 'One' });
    const second = await ctx.h.seedQuiz({ title: 'Two' });
    const outside = await ctx.h.seedQuiz({ title: 'Outside' });
    const id = await selectionOf([first.id, second.id]);
    const host = ctx.h.connectHost();
    const { pin } = await host.emitWithAck('host:create', { selectionId: id });
    const { socket: player } = await ctx.h.join(pin, 'Tia');
    await toPodium(host, pin, player);
    // Back in the lobby on Two; the host plays another quiz instead.
    await host.emitWithAck('host:back-to-lobby', { pin, archive: false });
    await host.emitWithAck('host:next-quiz', { pin, quizId: outside.id });
    await toPodium(host, pin, player);
    const next = nextEvent<{ quizId: string }>(host, 'game:outline', {
      where: (o) => o.quizId !== '',
    });
    await host.emitWithAck('host:back-to-lobby', { pin, archive: false });
    expect((await next).quizId).toBe(second.id);
  }, 30_000);

  it('arms the lobby countdown only for a quiz that starts on its own', async () => {
    const first = await ctx.h.seedQuiz({ title: 'Opening' });
    const second = await ctx.h.seedQuiz({ title: 'Follows' });
    const id = await selectionOf([first.id, second.id], { autoStart: true });
    const host = ctx.h.connectHost();
    const { pin } = await host.emitWithAck('host:create', { selectionId: id });
    const { socket: player } = await ctx.h.join(pin, 'Uma');
    await toPodium(host, pin, player);
    const countdown = nextEvent<{ startAt: number | null }>(host, 'lobby:countdown', {
      where: (c) => c.startAt !== null,
    });
    await host.emitWithAck('host:back-to-lobby', { pin, archive: false });
    expect((await countdown).startAt).toBeGreaterThan(Date.now());
  }, 30_000);

  it("another host's launch of a shared selection never reaches its owner", async () => {
    const owner = await prisma.user.create({
      data: { oidcSubject: `test:sel-owner-${Date.now()}`, displayName: 'Owner', roles: ['host'] },
    });
    try {
      const theirs = await ctx.h.seedQuiz({ ownerId: owner.id, title: 'Theirs', shared: true });
      const s = await prisma.selection.create({
        data: {
          ownerId: owner.id,
          name: 'Shared one',
          shared: true,
          items: { create: [{ quizId: theirs.id, orderIndex: 0, autoStart: false }] },
        },
      });
      selections.push(s.id);
      const host = ctx.h.connectHost();
      const { pin } = await host.emitWithAck('host:create', { selectionId: s.id });
      const { socket: player } = await ctx.h.join(pin, 'Vic');
      await toPodium(host, pin, player); // theirs: nothing kept
      // The host goes on with a quiz of their own, kept: it does not count for the selection.
      await host.emitWithAck('host:back-to-lobby', { pin, archive: false });
      await host.emitWithAck('host:next-quiz', { pin, quizId: ctx.quizId });
      await toPodium(host, pin, player);
      await host.emitWithAck('host:back-to-lobby', { pin, archive: true });
      const kept = await prisma.gameSessionLog.findFirst({
        where: { pin },
        orderBy: { startedAt: 'desc' },
      });
      expect(kept?.quizId).toBe(ctx.quizId);
      expect(kept?.selectionId).toBeNull();
    } finally {
      await prisma.selection.deleteMany({ where: { ownerId: owner.id } });
      await prisma.quiz.deleteMany({ where: { ownerId: owner.id } });
      await prisma.user.delete({ where: { id: owner.id } });
    }
  }, 30_000);

  it('refuses a selection with nothing to play, and one the host cannot see', async () => {
    const draft = await ctx.h.seedQuiz({ title: 'Only a draft', status: 'draft' });
    const id = await selectionOf([draft.id]);
    const host = ctx.h.connectHost();
    expect(await host.emitWithAck('host:create', { selectionId: id })).toMatchObject({
      ok: false,
      error: { code: 'selection.nothing_playable' },
    });
    expect(
      await host.emitWithAck('host:create', { selectionId: '01NOSUCHSELECTION000000000' }),
    ).toMatchObject({ ok: false, error: { code: 'selection.not_found' } });
  });
}
