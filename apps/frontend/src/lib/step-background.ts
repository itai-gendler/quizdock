import type { BackgroundStyle, SlideBackground, SlideGradient } from '@quiz-dock/contracts';
import type { MediaResolver } from './media-url';

/**
 * A step's background as the live screens receive it (docs/themes.md): its picture or
 * its gradient laid as its style says, or its plain colour; null: the quiz theme's.
 */
export function stepBackground(
  mediaId: string | null | undefined,
  gradient: unknown,
  style: unknown,
  url: MediaResolver,
): SlideBackground | null {
  const s = (style ?? undefined) as BackgroundStyle | undefined;
  const base = mediaId
    ? { url: url(mediaId) }
    : gradient
      ? { gradient: gradient as SlideGradient }
      : s?.color
        ? { color: s.color }
        : null;
  if (!base) return null;
  return s ? { ...base, style: s } : base;
}
