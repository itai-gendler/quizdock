import { OPTION_COLORS } from '@quiz-dock/contracts';
import { useEffect, useRef } from 'react';
import { useMotionLevel } from './motion/level';
import { useLiveTheme } from './theme';

const DURATION_MS = 2600;
const PIECES = 140;

/**
 * The quiz theme's reveal effect (THEMING §2.5), over the projection only: confetti in
 * the theme's colours, falling once. An exception to the motion rules, bounded: off
 * with the room's *Animations* switch and the device's reduced motion, and never in
 * the way — nothing waits for it, it catches no click.
 */
export function RevealEffect({ playKey }: { playKey: string }) {
  const theme = useLiveTheme();
  const level = useMotionLevel();
  const canvas = useRef<HTMLCanvasElement>(null);
  const effect = theme?.motion.revealEffect ?? null;
  const colors = theme
    ? [...OPTION_COLORS.map((c) => theme.slots[c].color), theme.accent].join(',')
    : '';

  useEffect(() => {
    const el = canvas.current;
    if (!el || effect !== 'confetti' || level !== 'full') return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const { width, height } = el.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    el.width = width * ratio;
    el.height = height * ratio;
    ctx.scale(ratio, ratio);
    const palette = colors.split(',');
    const unit = Math.min(width, height) / 100;
    const pieces = Array.from({ length: PIECES }, (_, i) => ({
      x: Math.random() * width,
      y: -Math.random() * height * 0.5,
      w: unit * (0.8 + Math.random() * 0.8),
      h: unit * (0.4 + Math.random() * 0.5),
      vy: unit * (0.35 + Math.random() * 0.45),
      vx: unit * (Math.random() - 0.5) * 0.3,
      turn: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
      color: palette[i % palette.length],
    }));
    let frame = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, width, height);
      // The last half second fades out rather than stopping.
      ctx.globalAlpha = Math.min(1, (DURATION_MS - t) / 500);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.turn += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.turn);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.turn)));
        ctx.restore();
      }
      if (t < DURATION_MS) frame = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, width, height);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [playKey, effect, level, colors]);

  if (effect !== 'confetti' || level !== 'full') return null;
  return (
    <canvas
      ref={canvas}
      aria-hidden
      data-motion="reveal-effect"
      className="pointer-events-none absolute inset-0 z-40 h-full w-full"
    />
  );
}
