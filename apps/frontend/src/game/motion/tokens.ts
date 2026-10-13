import type { MotionStyle } from '@quiz-dock/contracts';
import { useLiveTheme } from '../theme';

/**
 * How the live screens move (UI system §1.8), in seconds: the one place to tune
 * the pace. Short on purpose — nothing in the game waits for an animation.
 */
export const MOTION = {
  /** The previous step's background fading out over the new one. */
  fade: 0.5,
  /** Each top-level element of a step coming in… */
  enter: 0.35,
  /** …after the background has started to change… */
  enterDelay: 0.2,
  /** …one after the other. */
  stagger: 0.08,
  /** A row sliding to its new place, a bar filling. */
  move: 0.7,
  /** A score counting up to its new value. */
  count: 0.9,
  /** A count that changes, a mark that appears. */
  pop: 0.3,
  /** How far below its place a step's element starts (px). */
  rise: 16,
};
export type Motion = typeof MOTION;

/**
 * The pace each motion style of a quiz theme sets (docs/themes.md); `standard` is the
 * one above. The room's *Animations* switch and the device's reduced motion still win.
 */
export const MOTION_BY_STYLE: Record<MotionStyle, Motion> = {
  standard: MOTION,
  sober: {
    fade: 0.4,
    enter: 0.25,
    enterDelay: 0.1,
    stagger: 0,
    move: 0.5,
    count: 0.5,
    pop: 0.2,
    rise: 0,
  },
  dynamic: {
    fade: 0.35,
    enter: 0.3,
    enterDelay: 0.1,
    stagger: 0.06,
    move: 0.55,
    count: 0.7,
    pop: 0.35,
    rise: 24,
  },
  festive: {
    fade: 0.6,
    enter: 0.45,
    enterDelay: 0.2,
    stagger: 0.12,
    move: 0.8,
    count: 1.1,
    pop: 0.45,
    rise: 32,
  },
};

/** The pace of the live screen this is drawn in: its quiz theme's style. */
export function useMotion(): Motion {
  return MOTION_BY_STYLE[useLiveTheme()?.motion.style ?? 'standard'];
}

/** Fast out, soft landing: what comes in settles instead of stopping. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
