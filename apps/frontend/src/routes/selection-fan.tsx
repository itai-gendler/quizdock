import { ListOrdered } from 'lucide-react';
import { mediaUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';
import type { SelectionDtoPreviewItem } from '../api/generated/model';
import { QuizFirstStep } from './quiz-first-step';

/** Where each of the three fans out, the first in front (UI: a selection's picture). */
const PLACES = [
  'left-[20%] top-[24%] z-20',
  'left-[5%] top-[18%] z-10 -rotate-6',
  'right-[5%] top-[18%] z-0 rotate-6',
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
              'absolute w-[60%] overflow-hidden rounded-sm border shadow-sm',
              // Alone, it stands in the middle; with others, they fan out behind it.
              preview.length === 1 ? 'top-[20%] left-[20%]' : PLACES[i],
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
