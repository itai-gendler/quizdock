import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Sortable `<li>` of a dnd-kit list: hands its drag handle to the row, which keeps
 * its arrows for the keyboard and assistive technologies.
 */
export function SortableRow({
  id,
  handleLabel,
  className,
  children,
}: {
  id: string;
  /** What the handle is for, read by screen readers. */
  handleLabel: string;
  className?: string;
  children: (handle: ReactNode) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      aria-label={handleLabel}
      className="text-muted-foreground hover:text-foreground -ml-1 cursor-grab touch-none rounded p-1 active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(className, isDragging && 'bg-background relative z-10 shadow-md')}
    >
      {children(handle)}
    </li>
  );
}
