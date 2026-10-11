import { OPTION_COLORS } from './question-content';
import type { ThemeBackground, ThemeSlotName, ThemeValues } from './theme';
import {
  BLACK,
  COLOR_VISIONS,
  type ColorVision,
  type Rgb,
  WHITE,
  blend,
  contrast,
  contrastOfLuminances,
  distance,
  luminance,
  parseHex,
  simulate,
  textOn,
} from './theme-color';

/**
 * A theme's accessibility, computed and never declared (THEMING §1.2): run live in the
 * editors and by the server at every save, stored with the theme, informative only.
 * Each failed check has a domain code with its own translated text.
 */

export const ACCESSIBILITY_STATUSES = ['compliant', 'warnings', 'non_compliant'] as const;
export type AccessibilityStatus = (typeof ACCESSIBILITY_STATUSES)[number];

export const ACCESSIBILITY_CHECKS = [
  /** The text on a slot (white or black, picked automatically) reaches 4.5:1. */
  'slot_text_contrast',
  /** The prompt's text reaches 4.5:1 on the background as rendered. */
  'text_background_contrast',
  /** A slot stands out from the background: 3:1 (WCAG 1.4.11). */
  'slot_background_contrast',
  /** The accent stands out from the background: 3:1. */
  'accent_background_contrast',
  /** Two slots look different. */
  'slots_distinct',
  /** Two slots look different under a colour-blindness simulation. */
  'slots_distinct_color_vision',
  /** Two slots carry different icons. */
  'icons_distinct',
] as const;
export type AccessibilityCheckCode = (typeof ACCESSIBILITY_CHECKS)[number];

export interface AccessibilityCheck {
  code: AccessibilityCheckCode;
  passed: boolean;
  /** The slots at fault, for a check that is about slots. */
  slots?: ThemeSlotName[];
  /** The colour vision at fault, for `slots_distinct_color_vision`. */
  vision?: ColorVision;
}

export interface ThemeAccessibility {
  status: AccessibilityStatus;
  checks: AccessibilityCheck[];
}

/** Checks a failure of which makes a theme non-compliant: text that cannot be read. */
const BLOCKING: readonly AccessibilityCheckCode[] = [
  'slot_text_contrast',
  'text_background_contrast',
];

export const TEXT_CONTRAST = 4.5;
export const GRAPHIC_CONTRAST = 3;
/** OKLab distance two slots keep, in plain sight and under a colour-vision simulation. */
export const SLOT_DISTANCE = 0.08;
export const SLOT_DISTANCE_COLOR_VISION = 0.04;

/**
 * The darkest and the lightest the background can be once rendered: a picture may hold
 * any colour, so it is bounded by black and white, laid as the mode lays it.
 */
export function backgroundExtremes(bg: ThemeBackground): [Rgb, Rgb] {
  const base = parseHex(bg.color);
  if (bg.gradient) {
    const stops = bg.gradient.colors.map(parseHex).sort((a, b) => luminance(a) - luminance(b));
    return [stops[0], stops[stops.length - 1]];
  }
  if (!bg.image) return [base, base];
  if (bg.mode === 'cover') {
    const veil = bg.veil;
    if (!veil) return [BLACK, WHITE];
    const color = parseHex(veil.color);
    return [blend(color, BLACK, veil.opacity), blend(color, WHITE, veil.opacity)];
  }
  // watermark, contain, pattern: the picture at its opacity over the base colour.
  const opacity = bg.opacity ?? 1;
  return [blend(BLACK, base, opacity), blend(WHITE, base, opacity)];
}

/** The lowest contrast `color` keeps against any colour between the two extremes. */
export function worstContrast(color: Rgb, [dark, light]: [Rgb, Rgb]): number {
  const l = luminance(color);
  const [lo, hi] = [luminance(dark), luminance(light)];
  if (l >= lo && l <= hi) return 1;
  return Math.min(contrastOfLuminances(l, lo), contrastOfLuminances(l, hi));
}

/**
 * Icons are compared by their content: two slots with the same picture fail. A
 * silhouette comparison is still to be defined (THEMING §7).
 */
export interface IconFingerprints {
  /** A fingerprint of each slot's icon (its sanitised content); absent: the option's shape. */
  [slot: string]: string | undefined;
}

export function themeAccessibility(
  theme: ThemeValues,
  icons: IconFingerprints = {},
): ThemeAccessibility {
  const checks: AccessibilityCheck[] = [];
  const slots = OPTION_COLORS.map((name) => ({ name, rgb: parseHex(theme.slots[name].color) }));
  const extremes = backgroundExtremes(theme.background);
  const failing = (test: (s: (typeof slots)[number]) => boolean) =>
    slots.filter((s) => !test(s)).map((s) => s.name);
  const push = (code: AccessibilityCheckCode, at: ThemeSlotName[], extra = {}) =>
    checks.push(at.length ? { code, passed: false, slots: at, ...extra } : { code, passed: true });

  push(
    'slot_text_contrast',
    failing((s) => contrast(textOn(s.rgb), s.rgb) >= TEXT_CONTRAST),
  );

  const text = theme.background.textTone === 'light' ? WHITE : BLACK;
  checks.push({
    code: 'text_background_contrast',
    passed: worstContrast(text, extremes) >= TEXT_CONTRAST,
  });

  push(
    'slot_background_contrast',
    failing((s) => worstContrast(s.rgb, extremes) >= GRAPHIC_CONTRAST),
  );

  checks.push({
    code: 'accent_background_contrast',
    passed: worstContrast(parseHex(theme.accent), extremes) >= GRAPHIC_CONTRAST,
  });

  const close = (rgb: (c: Rgb) => Rgb, min: number) => {
    const at = new Set<ThemeSlotName>();
    for (let i = 0; i < slots.length; i++)
      for (let j = i + 1; j < slots.length; j++)
        if (distance(rgb(slots[i].rgb), rgb(slots[j].rgb)) < min) {
          at.add(slots[i].name);
          at.add(slots[j].name);
        }
    return [...at];
  };
  push(
    'slots_distinct',
    close((c) => c, SLOT_DISTANCE),
  );
  const vision = COLOR_VISIONS.map((v) => ({
    v,
    at: close((c) => simulate(c, v), SLOT_DISTANCE_COLOR_VISION),
  })).find((r) => r.at.length);
  push('slots_distinct_color_vision', vision?.at ?? [], vision ? { vision: vision.v } : {});

  const seen = new Map<string, ThemeSlotName>();
  const twins = new Set<ThemeSlotName>();
  for (const s of slots) {
    const print = icons[s.name];
    if (!print) continue;
    const other = seen.get(print);
    if (other) twins.add(other).add(s.name);
    else seen.set(print, s.name);
  }
  push('icons_distinct', [...twins]);

  const failed = checks.filter((c) => !c.passed);
  const status: AccessibilityStatus = failed.some((c) => BLOCKING.includes(c.code))
    ? 'non_compliant'
    : failed.length
      ? 'warnings'
      : 'compliant';
  return { status, checks };
}
