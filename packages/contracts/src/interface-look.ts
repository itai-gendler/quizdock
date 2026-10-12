import { z } from 'zod';
import { backgroundStyleSchema } from './background';
import { fontSchema, shippedPictureRef } from './theme';
import {
  HEX_COLOR,
  type Rgb,
  WHITE,
  contrast,
  fromOklch,
  oklch,
  parseHex,
  toHex,
} from './theme-color';

/**
 * The instance's look (THEMING lot 2): the interface's colours, font, corners and the
 * backgrounds of its showcase pages, set by an administrator and kept in the database.
 * Never the live screens': those wear the quiz's theme.
 */

/** Corner radius, in rem: the app's `--radius`. */
export const LOOK_RADII = { square: 0.25, standard: 0.625, rounded: 1.125 } as const;
export type LookRadius = keyof typeof LOOK_RADII;

export const SHOWCASE_MODES = ['none', 'logo', 'picture'] as const;

const hex = z.string().regex(HEX_COLOR);
const mediaId = z.string().length(26);

export const interfaceLookSchema = z
  .object({
    /** Buttons, selected filters, the focus ring; their text is white. */
    primary: hex,
    /** Links and the mark of the current page. */
    accent: hex,
    font: fontSchema(mediaId),
    radius: z.enum(Object.keys(LOOK_RADII) as [LookRadius, ...LookRadius[]]),
    /** Home, join, sign-in, error and not-found pages; working pages stay plain. */
    showcase: z
      .object({
        mode: z.enum(SHOWCASE_MODES),
        /** The logo watermark: % of the page's short side, and its opacity. */
        size: z.number().int().min(15).max(90),
        opacity: z.number().min(0.02).max(0.3),
        /** The picture, laid as a quiz background is (a light page: dark text over it). */
        picture: z
          .object({ image: mediaId.or(shippedPictureRef), style: backgroundStyleSchema })
          .strict()
          .nullable(),
      })
      .strict(),
  })
  .strict();
export type InterfaceLook = z.infer<typeof interfaceLookSchema>;

/** QuizDock's own look: what an instance shows until an administrator changes it. */
export const DEFAULT_LOOK: InterfaceLook = {
  primary: '#2b62ef',
  accent: '#2b62ef',
  font: { builtin: 'system' },
  radius: 'standard',
  showcase: { mode: 'logo', size: 80, opacity: 0.06, picture: null },
};

/** The dark page the dark mode lays everything on. */
export const DARK_PAGE: Rgb = parseHex('#0e0e0e');
/** How comfortably a link must read on the dark page. */
export const LINK_ON_DARK = 7;

/**
 * A colour as a link on the dark page: the same hue, lightened until it reads
 * comfortably (7:1). Buttons keep the colour itself, under white text, in both modes.
 */
export function linkOnDark(color: string): string {
  const c = parseHex(color);
  const [L, C, h] = oklch(c);
  for (let l = L; l <= 0.97; l += 0.01) {
    const x = fromOklch([l, C, h]);
    if (contrast(x, DARK_PAGE) >= LINK_ON_DARK) return toHex(x);
  }
  return '#ffffff';
}

export const LOOK_CHECKS = [
  'button_text_contrast',
  'primary_on_light',
  'primary_on_dark',
  'link_on_light',
  'link_on_dark',
] as const;

/** The look's accessibility, measured on its colours (only an accessible look says so). */
export function lookAccessibility(look: Pick<InterfaceLook, 'primary' | 'accent'>) {
  const p = parseHex(look.primary);
  const a = parseHex(look.accent);
  const checks: { code: (typeof LOOK_CHECKS)[number]; passed: boolean }[] = [
    { code: 'button_text_contrast', passed: contrast(WHITE, p) >= 4.5 },
    { code: 'primary_on_light', passed: contrast(p, WHITE) >= 3 },
    { code: 'primary_on_dark', passed: contrast(p, DARK_PAGE) >= 3 },
    { code: 'link_on_light', passed: contrast(a, WHITE) >= 4.5 },
    { code: 'link_on_dark', passed: contrast(parseHex(linkOnDark(look.accent)), DARK_PAGE) >= 4.5 },
  ];
  return { accessible: checks.every((c) => c.passed), checks };
}
