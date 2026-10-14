import { type Prisma, QuizStatus } from '@prisma/client';
import type { GameMode } from '@quiz-dock/contracts';
import type { PrismaService } from '../prisma/prisma.service';
import { readableBy } from '../quizzes/quiz-access';

/** At most this many quizzes in a selection (SPECIFICATIONS-SELECTION, against abuse only). */
export const SELECTION_ITEMS_MAX = 50;

/** Why a quiz one may read cannot be played. */
export type UnplayableReason = 'draft' | 'archived' | 'empty';

/** A quiz of a selection as one host sees it: only those they may read. */
export interface SelectionLine {
  quizId: string;
  title: string;
  coverMediaId: string | null;
  ownerId: string;
  ownerName: string;
  status: QuizStatus;
  questionCount: number;
  mode: GameMode;
  autoStart: boolean;
  /** Null when it can be played. */
  unplayable: UnplayableReason | null;
}

/**
 * The selections a host may see: theirs, and those shared with at least one quiz
 * they may read — one with none does not show (SPECIFICATIONS-SELECTION).
 */
export function visibleSelection(userId: string): Prisma.SelectionWhereInput {
  return {
    OR: [{ ownerId: userId }, { shared: true, items: { some: { quiz: readableBy(userId) } } }],
  };
}

export function unplayableReason(quiz: {
  status: QuizStatus;
  questionCount: number;
}): UnplayableReason | null {
  if (quiz.status === QuizStatus.archived) return 'archived';
  if (quiz.status !== QuizStatus.ready) return 'draft';
  return quiz.questionCount > 0 ? null : 'empty';
}

/** The lines of a selection `userId` may read, in order. */
export async function linesOf(
  prisma: PrismaService,
  selectionId: string,
  userId: string,
): Promise<SelectionLine[]> {
  const items = await prisma.selectionItem.findMany({
    where: { selectionId, quiz: readableBy(userId) },
    orderBy: { orderIndex: 'asc' },
    include: {
      quiz: {
        select: {
          title: true,
          coverMediaId: true,
          ownerId: true,
          status: true,
          questionCount: true,
          owner: { select: { displayName: true } },
        },
      },
    },
  });
  return items.map(({ quiz, ...item }) => ({
    quizId: item.quizId,
    title: quiz.title,
    coverMediaId: quiz.coverMediaId,
    ownerId: quiz.ownerId,
    ownerName: quiz.owner.displayName,
    status: quiz.status,
    questionCount: quiz.questionCount,
    mode: item.mode === 'auto' ? 'auto' : 'manual',
    autoStart: item.autoStart,
    unplayable: unplayableReason(quiz),
  }));
}

/** The next quiz of the queue: the first playable one the room has not played yet. */
export function nextOf(lines: SelectionLine[], played: ReadonlySet<string>): SelectionLine | null {
  return lines.find((l) => l.unplayable === null && !played.has(l.quizId)) ?? null;
}
