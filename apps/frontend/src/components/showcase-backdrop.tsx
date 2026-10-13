import defaultLogoUrl from '@/assets/default-logo.svg';
import defaultLogoSvg from '@/assets/default-logo.svg?raw';
import defaultMarkUrl from '@/assets/default-mark.svg';
import { useEffect, useState } from 'react';
import { Surface } from '../game/surface';
import { type ResolvedLook, instanceLook } from '../lib/look';
import { cn } from '@/lib/utils';
import { useLogoCandidate } from './brand-logo';

/**
 * The background of a showcase page — home, join, sign-in, error, not found — as the
 * instance's look sets it (THEMING lot 2): nothing, the logo as a watermark, or a
 * picture laid as a quiz background is. Working pages stay plain. `contained`: inside a
 * preview frame rather than behind the whole window.
 */
export function ShowcaseBackdrop({
  look = instanceLook,
  logo,
  contained = false,
}: {
  look?: ResolvedLook;
  /** The logo to draw, when it is known (a preview); else the header's. */
  logo?: string;
  contained?: boolean;
}) {
  // Behind the page's content: in the frame's stacking context (`isolate`), or the window's.
  const layer = cn('pointer-events-none -z-10', contained ? 'absolute inset-0' : 'fixed inset-0');
  const { showcase } = look;
  if (showcase.mode === 'picture' && look.pictureUrl && showcase.picture) {
    return (
      <Surface
        background={{ url: look.pictureUrl, style: showcase.picture.style }}
        textTone="dark"
        textOutline={false}
        className={layer}
      >
        {null}
      </Surface>
    );
  }
  if (showcase.mode !== 'logo') return null;
  return <Watermark look={look} logo={logo} className={layer} />;
}

/**
 * The logo's shape, in the text's colour, faded and centred: QuizDock's mark without
 * its square; an instance's logo by its outline (its transparent ground).
 */
function Watermark({
  look,
  logo,
  className,
}: {
  look: ResolvedLook;
  logo?: string;
  className: string;
}) {
  const [candidate, onError] = useLogoCandidate();
  const src = logo ?? candidate;
  const mask = useMaskOf(src);
  if (!src) return null;
  return (
    <div aria-hidden className={cn('[container-type:size]', className)}>
      {/* Probes the header's candidates: one that does not decode moves to the next. */}
      {logo ? null : <img src={src} alt="" hidden onError={onError} />}
      {mask ? (
        <div
          className="bg-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${look.showcase.size}cqmin`,
            height: `${look.showcase.size}cqmin`,
            opacity: look.showcase.opacity,
            maskImage: `url("${mask}")`,
            WebkitMaskImage: `url("${mask}")`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            // The mark: white draws, black cuts the Q's counter out; a logo: its outline.
            maskMode: mask === defaultMarkUrl ? 'luminance' : 'alpha',
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * What draws a logo's watermark: QuizDock's own logo — bundled, or the same file served
 * from `branding/` — gives its mark without the square; another, itself. Undefined while
 * it is being told apart.
 */
function useMaskOf(src: string | undefined): string | undefined {
  const [known, setKnown] = useState<{ src: string; mask: string } | null>(null);
  useEffect(() => {
    if (!src || src === defaultLogoUrl || !/\.svg(\?|$)/i.test(src)) return;
    let live = true;
    void fetch(src)
      .then((r) => (r.ok ? r.text() : ''))
      .catch(() => '')
      .then((text) => {
        if (live)
          setKnown({ src, mask: text.trim() === defaultLogoSvg.trim() ? defaultMarkUrl : src });
      });
    return () => {
      live = false;
    };
  }, [src]);
  if (!src) return undefined;
  if (src === defaultLogoUrl) return defaultMarkUrl;
  if (!/\.svg(\?|$)/i.test(src)) return src;
  return known?.src === src ? known.mask : undefined;
}
