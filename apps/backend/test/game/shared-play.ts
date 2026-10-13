import type { Socket } from 'socket.io-client';
import type { SessionNotice } from '@quiz-dock/contracts';
import { PrismaService } from '../../src/prisma/prisma.service';
import { type GameContext, nextEvent, settle } from '../game-harness';

type QuestionStart = { startedAt: number; options: Array<{ id: string; text: string }> };

/**
 * Another host's shared quiz, presented as it is (SPECIFICATIONS-SHARED-PLAY):
 * allowed when shared and ready, and nothing of the game reaches PostgreSQL but
 * its ratings, without nicknames.
 */
export function sharedPlayTests(ctx: GameContext): void {
  let prisma: PrismaService;
  let ownerId: string;
  const subject = 'test:shared-play-owner';
  const connect = (auth?: Record<string, string>): Socket => ctx.h.connect(auth);

  beforeAll(async () => {
    prisma = ctx.h.prisma;
    ownerId = (
      await prisma.user.upsert({
        where: { oidcSubject: subject },
        create: { oidcSubject: subject, displayName: 'Owner', roles: ['host'] },
        update: {},
      })
    ).id;
  });

  afterAll(async () => {
    await prisma.quiz.deleteMany({ where: { ownerId } });
    await prisma.user.deleteMany({ where: { oidcSubject: subject } });
  });

  /** A quiz of the other host, shared and ready unless `overrides` say otherwise. */
  const sharedQuiz = (
    overrides: { shared?: boolean; status?: 'draft' | 'ready' | 'archived' } = {},
  ) => ctx.h.seedQuiz({ ownerId, title: 'Shared quiz', shared: true, ...overrides });

  /** Answers Paris on the current question; resolves at the reveal. */
  async function playParis(host: Socket, pin: string, player: Socket) {
    const start = nextEvent<QuestionStart>(player, 'question:start');
    const reveal = nextEvent(player, 'question:reveal');
    host.emit('host:start', { pin });
    const q = await start;
    await settle(Math.max(0, q.startedAt - Date.now()) + 50);
    const paris = q.options.find((o) => o.text === 'Paris')!.id;
    player.emit('player:submit', { pin, questionIndex: 0, answer: paris });
    await reveal;
  }

  it('presents a shared, ready quiz of another host; the room is told nothing is recorded', async () => {
    const quiz = await sharedQuiz();
    const host = ctx.h.connectHost();
    const { pin } = await host.emitWithAck('host:create', {
      quizId: quiz.id,
      fullCapture: true,
      personalTracking: true,
    });
    expect(pin).toMatch(/^\d{6}$/);
    const player = connect();
    const notice = nextEvent<SessionNotice>(player, 'notice');
    await player.emitWithAck('player:join', { pin, nickname: 'Nina' });
    expect(await notice).toMatchObject({
      keepResults: false,
      fullCapture: false,
      personalTracking: false,
    });
  });

  it("refuses another host's quiz that is not shared, or not ready", async () => {
    const host = ctx.h.connectHost();
    const cases = [
      [await sharedQuiz({ shared: false }), 'quiz.not_found'],
      [await sharedQuiz({ status: 'draft' }), 'quiz.not_ready'],
      [await sharedQuiz({ status: 'archived' }), 'quiz.not_ready'],
    ] as const;
    for (const [quiz, code] of cases) {
      expect(await host.emitWithAck('host:create', { quizId: quiz.id })).toMatchObject({
        ok: false,
        error: { code },
      });
    }
  });

  it('keeps nothing on any archive path, and its ratings come without nickname', async () => {
    const quiz = await sharedQuiz();
    const host = ctx.h.connectHost();
    const { pin } = await host.emitWithAck('host:create', { quizId: quiz.id, fullCapture: true });
    const { socket: player } = await ctx.h.join(pin, 'Olga');
    await playParis(host, pin, player);

    // Closing the quiz mid-way, keeping what was played: nothing kept.
    expect(await host.emitWithAck('host:back-to-lobby', { pin, archive: true })).toEqual({
      ok: true,
    });
    // The room goes on with it again, to its end, keeping the results: still nothing.
    await host.emitWithAck('host:next-quiz', { pin, quizId: quiz.id });
    await playParis(host, pin, player);
    const podium = nextEvent(player, 'game:podium');
    host.emit('host:next', { pin });
    await podium;
    expect((await player.emitWithAck('player:rate', { pin, rating: 5, comment: 'Top' })).ok).toBe(
      true,
    );
    const ended = nextEvent(player, 'game:ended');
    host.emit('host:end', { pin, archive: true });
    await ended;
    await settle(200);

    expect(await prisma.gameSessionLog.count({ where: { quizId: quiz.id } })).toBe(0);
    const rating = await prisma.quizFeedback.findFirst({ where: { quizId: quiz.id } });
    expect(rating).toMatchObject({ rating: 5, comment: 'Top', nickname: null });
  }, 30_000);

  it('keeps nothing when the host never comes back either', async () => {
    const quiz = await sharedQuiz();
    const host = ctx.h.connectHost();
    const { pin } = await host.emitWithAck('host:create', { quizId: quiz.id });
    const { socket: player } = await ctx.h.join(pin, 'Paul');
    await playParis(host, pin, player);
    const ended = nextEvent(player, 'game:ended', { timeoutMs: 8_000 });
    host.disconnect(); // past the grace and the window: the game ends on its own
    await ended;
    await settle(200);
    expect(await prisma.gameSessionLog.count({ where: { quizId: quiz.id } })).toBe(0);
  }, 15_000);

  it('goes on when the owner deletes the quiz meanwhile; the next launch is refused', async () => {
    const quiz = await sharedQuiz();
    const host = ctx.h.connectHost();
    const { pin } = await host.emitWithAck('host:create', { quizId: quiz.id });
    const { socket: player } = await ctx.h.join(pin, 'Quinn');
    await prisma.quiz.delete({ where: { id: quiz.id } });
    await playParis(host, pin, player); // played from its snapshot
    const podium = nextEvent(player, 'game:podium');
    host.emit('host:next', { pin });
    await podium;
    // Nothing to rate any more, and no error for it.
    expect((await player.emitWithAck('player:rate', { pin, rating: 3 })).ok).toBe(false);
    expect(await host.emitWithAck('host:create', { quizId: quiz.id })).toMatchObject({
      ok: false,
      error: { code: 'quiz.not_found' },
    });
  }, 15_000);
}
