import type { SlideTextTone, ThemeValues } from '@quiz-dock/contracts';
import { type SurfaceBackground, themeBackdrop } from '../theme';
import type { GameView } from '../use-game-session';

/**
 * Which step a live screen shows: the motion layer moves when it changes. A
 * question keeps its step while it loads and is answered; its reveal, the
 * standings after it and the podium are steps of their own.
 */
export function stepKeyOf(view: Pick<GameView, 'state' | 'questionIndex' | 'slide'>): string {
  switch (view.state) {
    case 'SLIDE_SHOW':
      return `slide:${view.slide?.slideIndex ?? 0}`;
    case 'MEDIA_LOADING':
    case 'QUESTION_SHOW':
    case 'ANSWERING':
      return `question:${view.questionIndex}`;
    case 'REVEAL':
      return `reveal:${view.questionIndex}`;
    case 'LEADERBOARD':
      return `standings:${view.questionIndex}`;
    default:
      return view.state ?? 'none';
  }
}

/** What a step is drawn on: its background, a video (its veil), or the page itself (null). */
export type Backdrop =
  | { background: SurfaceBackground; textTone: SlideTextTone }
  | { video: true; textTone: SlideTextTone }
  | null;

/** The same backdrop twice: nothing to fade. */
export const sameBackdrop = (a: Backdrop, b: Backdrop) => JSON.stringify(a) === JSON.stringify(b);

/**
 * The backdrop a live screen draws the step on: the slide's background or video, the
 * question's background when it owns the screen, else the quiz theme's (THEMING §2.4),
 * else the page.
 */
export function backdropOf(
  view: Pick<GameView, 'state' | 'slide' | 'question'>,
  questionOwnsBackground: boolean,
  theme: ThemeValues | null = null,
): Backdrop {
  if (view.state === 'SLIDE_SHOW' && view.slide) {
    if (view.slide.video) return { video: true, textTone: view.slide.textTone };
    if (view.slide.background) {
      return { background: view.slide.background, textTone: view.slide.textTone };
    }
  } else if (questionOwnsBackground && view.question?.background) {
    return { background: view.question.background, textTone: view.question.textTone ?? 'light' };
  }
  return themeBackdrop(theme);
}
