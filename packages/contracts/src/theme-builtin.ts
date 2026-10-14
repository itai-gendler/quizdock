import { OPTION_ORDER } from './question-content';
import type { BuiltinTheme, ThemeFont, ThemeSlot, ThemeSlotName, ThemeValues } from './theme';
import { ICON_SETS } from './theme-icons';

/**
 * The shipped themes (docs/themes.md). *Classic* is the default. Slots list their colours
 * in `OPTION_COLORS` order; a null icon is the slot's shipped glyph, an animal
 * (`shape-icon.tsx`), which *Kids* keeps.
 */

const slots = (colors: string[]): Record<ThemeSlotName, ThemeSlot> => {
  const names: ThemeSlotName[] = [
    'red',
    'blue',
    'yellow',
    'green',
    'purple',
    'orange',
    'pink',
    'teal',
  ];
  return Object.fromEntries(
    names.map((name, i) => [name, { color: colors[i], icon: null }]),
  ) as Record<ThemeSlotName, ThemeSlot>;
};

/**
 * The same slots, each with an icon of the bank (`group/name`), given in the default order
 * of the answers (green, red, blue, yellow…).
 */
const withIcons = (
  base: Record<ThemeSlotName, ThemeSlot>,
  icons: string[],
): Record<ThemeSlotName, ThemeSlot> =>
  Object.fromEntries(
    OPTION_ORDER.map((p, i) => [p.color, { ...base[p.color], icon: `bank:${icons[i]}` }]),
  ) as Record<ThemeSlotName, ThemeSlot>;

/** Geometric, but not the usual triangle, diamond, circle and square; no two alike. */
const SHAPES = [
  'symbols/star-five',
  'symbols/hexagon',
  'symbols/x-bold',
  'symbols/crescent',
  'symbols/heart',
  'symbols/semicircle',
  'symbols/star-four',
  'symbols/bowtie',
];
const PARTY = [
  'new-year/confetti',
  'new-year/balloon',
  'objects/gift',
  'objects/crown',
  'new-year/music-notes',
  'new-year/sparkle',
  'objects/bell',
  'new-year/champagne',
];
const NIGHT_SKY = [
  'nature/moon',
  'nature/star',
  'travel/rocket',
  'nature/cloud',
  'nature/lightning',
  'nature/snowflake',
  'nature/drop',
  'nature/mountains',
];

const CLASSIC_SLOTS = [
  '#e7000b',
  '#155dfc',
  '#fe9a00',
  '#00a63e',
  '#9810fa',
  '#ff6900',
  '#e60076',
  '#009689',
];

/** Classic's hues, less saturated (its settled yellow kept): Sober's quieter answers. */
const SOBER_SLOTS = [
  '#c8423b',
  '#3b6cc9',
  '#fe9a00',
  '#2f9461',
  '#7f57c2',
  '#dd6a2e',
  '#c4507f',
  '#2b8a84',
];

/**
 * The accessible themes' answers, made for the constraint before the look: every colour,
 * its yellow included, dark enough for white text (4.8:1 at least), the first four apart
 * for colour-blind players too. On *High contrast light*'s white.
 */
const ACCESSIBLE = [
  '#a9000f',
  '#003fb7',
  '#956700',
  '#008332',
  '#7700bb',
  '#a14600',
  '#ae0066',
  '#007671',
];

/**
 * *High contrast*'s answers on its black: light enough to stand out from it (3:1), dark
 * enough for white text (4.5:1) — a narrow band, every colour placed in it.
 */
const ACCESSIBLE_ON_DARK = [
  '#b60020',
  '#004edb',
  '#956700',
  '#008734',
  '#9300e7',
  '#c74a00',
  '#c40074',
  '#007d78',
];

/**
 * A seasonal theme: its shipped picture under a veil, its season's icons from the bank,
 * its own palette (in the default order of the answers: green, red, blue, yellow…).
 */
function seasonal(t: {
  picture: 'halloween' | 'christmas' | 'new-year' | 'easter' | 'summer';
  color: string;
  textTone: 'light' | 'dark';
  veil: { color: string; opacity: number };
  answers: string[];
  accent: string;
  font: ThemeFont;
  confetti: boolean;
}): ThemeValues {
  return {
    background: {
      color: t.color,
      textTone: t.textTone,
      image: `shipped:${t.picture}.svg`,
      mode: 'cover',
      veil: t.veil,
    },
    slots: Object.fromEntries(
      OPTION_ORDER.map((p, i) => [
        p.color,
        { color: t.answers[i], icon: `bank:${t.picture}/${ICON_SETS[t.picture][i]}` },
      ]),
    ) as Record<ThemeSlotName, ThemeSlot>,
    accent: t.accent,
    font: { builtin: t.font },
    sounds: {},
    motion: { style: 'festive', revealEffect: t.confetti ? 'confetti' : null },
    markers: 'icons',
  };
}

export const BUILTIN_THEME_VALUES: Record<BuiltinTheme, ThemeValues> = {
  classic: {
    background: { color: '#ffffff', textTone: 'dark' },
    slots: withIcons(slots(CLASSIC_SLOTS), SHAPES),
    accent: '#2b62ef',
    font: { builtin: 'system' },
    sounds: {},
    motion: { style: 'standard', revealEffect: null },
    markers: 'icons',
  },
  sober: {
    background: { color: '#f5f5f4', textTone: 'dark' },
    slots: slots(SOBER_SLOTS),
    accent: '#334155',
    font: { builtin: 'inter' },
    sounds: {},
    motion: { style: 'sober', revealEffect: null },
    markers: 'letters',
  },
  kids: {
    background: {
      color: '#fff7e0',
      textTone: 'dark',
      gradient: { angle: 160, colors: ['#fff7e0', '#e0f2ff'] },
    },
    slots: slots(CLASSIC_SLOTS),
    accent: '#d4520a',
    font: { builtin: 'fredoka' },
    sounds: {},
    motion: { style: 'dynamic', revealEffect: null },
    markers: 'icons',
  },
  festive: {
    background: {
      color: '#2a0a4a',
      textTone: 'light',
      gradient: { angle: 135, colors: ['#2a0a4a', '#5b1a6e', '#8a1c4a'] },
    },
    slots: withIcons(slots(CLASSIC_SLOTS), PARTY),
    accent: '#ffc93c',
    font: { builtin: 'nunito' },
    sounds: {},
    motion: { style: 'festive', revealEffect: 'confetti' },
    markers: 'icons',
  },
  night: {
    background: { color: '#0f172a', textTone: 'light' },
    slots: withIcons(slots(CLASSIC_SLOTS), NIGHT_SKY),
    accent: '#38bdf8',
    font: { builtin: 'system' },
    sounds: {},
    motion: { style: 'standard', revealEffect: null },
    markers: 'icons',
  },
  'high-contrast': {
    background: { color: '#000000', textTone: 'light' },
    slots: withIcons(slots(ACCESSIBLE_ON_DARK), SHAPES),
    accent: '#ffe14d',
    font: { builtin: 'atkinson' },
    sounds: {},
    motion: { style: 'sober', revealEffect: null },
    markers: 'icons',
  },
  'high-contrast-light': {
    background: { color: '#ffffff', textTone: 'dark' },
    slots: withIcons(slots(ACCESSIBLE), SHAPES),
    accent: '#1d4ed8',
    font: { builtin: 'atkinson' },
    sounds: {},
    motion: { style: 'sober', revealEffect: null },
    markers: 'icons',
  },
  halloween: seasonal({
    picture: 'halloween',
    color: '#14051f',
    textTone: 'light',
    veil: { color: '#0a0010', opacity: 0.35 },
    answers: [
      '#4e9a06',
      '#c1121f',
      '#3a2fa8',
      '#e8730c',
      '#7b2cbf',
      '#4b4453',
      '#9d174d',
      '#0f766e',
    ],
    accent: '#ff7a1a',
    font: 'fredoka',
    confetti: true,
  }),
  christmas: seasonal({
    picture: 'christmas',
    color: '#0b1d3a',
    textTone: 'light',
    veil: { color: '#06122a', opacity: 0.3 },
    answers: [
      '#1f7a3a',
      '#c1121f',
      '#1d4e89',
      '#d4a017',
      '#5b2a86',
      '#a0522d',
      '#b0175e',
      '#0f6b6b',
    ],
    accent: '#ffd166',
    font: 'nunito',
    confetti: true,
  }),
  'new-year': seasonal({
    picture: 'new-year',
    color: '#060818',
    textTone: 'light',
    veil: { color: '#05061a', opacity: 0.3 },
    answers: [
      '#0f8a6a',
      '#c2185b',
      '#1e40af',
      '#e6b422',
      '#6b21a8',
      '#b45309',
      '#db2777',
      '#0e7490',
    ],
    accent: '#ffd166',
    font: 'lexend',
    confetti: true,
  }),
  easter: seasonal({
    picture: 'easter',
    color: '#fff4e6',
    textTone: 'dark',
    veil: { color: '#ffffff', opacity: 0.3 },
    answers: [
      '#3f9a2e',
      '#d6336c',
      '#2f74d0',
      '#f2b705',
      '#7c4dff',
      '#e8590c',
      '#c2255c',
      '#0f9488',
    ],
    accent: '#7c4dff',
    font: 'nunito',
    confetti: false,
  }),
  summer: seasonal({
    picture: 'summer',
    color: '#bfe6ff',
    textTone: 'dark',
    veil: { color: '#ffffff', opacity: 0.25 },
    answers: [
      '#15a34a',
      '#e03131',
      '#0b72b9',
      '#f59f00',
      '#9c36b5',
      '#d9480f',
      '#d6336c',
      '#0c8599',
    ],
    accent: '#0b72b9',
    font: 'lexend',
    confetti: false,
  }),
};
