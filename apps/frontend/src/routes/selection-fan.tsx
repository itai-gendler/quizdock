import { ListOrdered } from 'lucide-react';
import { mediaUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';
import type { SelectionDtoPreviewItem } from '../api/generated/model';
import { QuizFirstStep } from './quiz-first-step';

/**
 * Where each of the three sits, as a hand of cards: all from the same place, turning
 * on a pivot under them, the first in front. The card's hover spreads them a little
 * further and lifts the first (only where motion is welcome).
 */
const PLACES = [
  'z-20 group-hover:-translate-y-[6%]',
  'z-10 -rotate-[10deg] group-hover:-rotate-[16deg]',
  'z-0 rotate-[10deg] group-hover:rotate-[16deg]',
] as const;

/**
 * A selection's picture: its first quizzes fanned out, each as its first step shows
 * it, the first in front — what it holds at a glance, as a quiz's card shows its first
 * step. An empty one is a neutral tile of the same size.
 */
export function SelectionFan({
  preview,
  className,
}: {
  preview: SelectionDtoPreviewItem[];
  className?: string;
}) {
  return (
    <span className={cn('bg-muted/40 relative block aspect-video overflow-hidden', className)}>
      {preview.length === 0 ? (
        <span className="text-muted-foreground flex size-full items-center justify-center">
          <ListOrdered className="size-6" aria-hidden />
        </span>
      ) : (
        preview.map((q, i) => (
          <QuizFirstStep
            key={q.quizId}
            quizId={q.quizId}
            hasCover={!!q.coverMediaId}
            fallback={<Cover coverMediaId={q.coverMediaId} />}
            className={cn(
              'absolute top-[22%] left-[22%] w-[56%] origin-[50%_250%] overflow-hidden rounded-sm border shadow-sm',
              'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out',
              // Alone, it stands in the middle; with others, they fan out behind it.
              preview.length === 1 ? PLACES[0] : PLACES[i],
            )}
          />
        ))
      )}
    </span>
  );
}

function Cover({ coverMediaId }: { coverMediaId: string | null }) {
  return coverMediaId ? (
    <img src={mediaUrl(coverMediaId)} alt="" loading="lazy" className="size-full object-cover" />
  ) : (
    <span className="bg-muted text-muted-foreground flex size-full items-center justify-center">
      <ListOrdered className="size-4" aria-hidden />
    </span>
  );
}
