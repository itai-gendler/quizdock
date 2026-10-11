import type { BuiltinTheme, ThemeSlot, ThemeSlotName, ThemeValues } from './theme';

/**
 * The shipped themes (THEMING §2.3). *Classic* is today's rendering, the default: an
 * upgrade changes only its glyphs. Slots list their colours in `OPTION_COLORS` order;
 * a null icon is the slot's shipped glyph (`shape-icon.tsx`).
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

/**
 * The shipped themes' answers: deep, saturated colours that carry white text (4.8:1 at
 * least), and a true yellow that carries black — a yellow dark enough for white is no
 * longer yellow. They stay apart, the first four (green, red, blue, yellow) for
 * colour-blind players too.
 */
const VIVID = [
  '#a9000f',
  '#003fb7',
  '#facc15',
  '#008332',
  '#7700bb',
  '#a14600',
  '#ae0066',
  '#007671',
];

export const BUILTIN_THEME_VALUES: Record<BuiltinTheme, ThemeValues> = {
  classic: {
    background: { color: '#ffffff', textTone: 'dark' },
    slots: slots(CLASSIC_SLOTS),
    accent: '#2b62ef',
    font: { builtin: 'system' },
    sounds: {},
    motion: { style: 'standard', revealEffect: null },
    markers: 'icons',
    slotText: 'light',
  },
  sober: {
    background: { color: '#f5f5f4', textTone: 'dark' },
    slots: slots(VIVID),
    accent: '#334155',
    font: { builtin: 'inter' },
    sounds: {},
    motion: { style: 'sober', revealEffect: null },
    markers: 'icons',
  },
  kids: {
    background: {
      color: '#fff7e0',
      textTone: 'dark',
      gradient: { angle: 160, colors: ['#fff7e0', '#e0f2ff'] },
    },
    slots: slots(VIVID),
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
    slots: slots(VIVID),
    accent: '#ffc93c',
    font: { builtin: 'nunito' },
    sounds: {},
    motion: { style: 'festive', revealEffect: 'confetti' },
    markers: 'icons',
  },
  night: {
    background: { color: '#0f172a', textTone: 'light' },
    slots: slots(VIVID),
    accent: '#38bdf8',
    font: { builtin: 'system' },
    sounds: {},
    motion: { style: 'standard', revealEffect: null },
    markers: 'icons',
  },
  'high-contrast': {
    background: { color: '#000000', textTone: 'light' },
    slots: slots(VIVID),
    accent: '#ffe14d',
    font: { builtin: 'atkinson' },
    sounds: {},
    motion: { style: 'sober', revealEffect: null },
    markers: 'icons',
  },
  halloween: {
    background: {
      color: '#1a1025',
      textTone: 'light',
      gradient: { angle: 180, colors: ['#1a1025', '#3a1a10'] },
    },
    slots: slots(VIVID),
    accent: '#ff8a1f',
    font: { builtin: 'nunito' },
    sounds: {},
    motion: { style: 'festive', revealEffect: null },
    markers: 'icons',
  },
  christmas: {
    background: {
      color: '#0b3d2e',
      textTone: 'light',
      gradient: { angle: 180, colors: ['#0b3d2e', '#14261f'] },
    },
    slots: slots(VIVID),
    accent: '#ffd166',
    font: { builtin: 'nunito' },
    sounds: {},
    motion: { style: 'festive', revealEffect: 'confetti' },
    markers: 'icons',
  },
  'new-year': {
    background: {
      color: '#0a0f2c',
      textTone: 'light',
      gradient: { angle: 160, colors: ['#0a0f2c', '#1d1446'] },
    },
    slots: slots(VIVID),
    accent: '#ffd700',
    font: { builtin: 'lexend' },
    sounds: {},
    motion: { style: 'festive', revealEffect: 'confetti' },
    markers: 'icons',
  },
  easter: {
    background: {
      color: '#fdf6ff',
      textTone: 'dark',
      gradient: { angle: 180, colors: ['#fdf6ff', '#f0fff4'] },
    },
    slots: slots(VIVID),
    accent: '#7b3fc4',
    font: { builtin: 'nunito' },
    sounds: {},
    motion: { style: 'dynamic', revealEffect: null },
    markers: 'icons',
  },
  summer: {
    background: {
      color: '#fff4d6',
      textTone: 'dark',
      gradient: { angle: 180, colors: ['#e3f6ff', '#fff4d6'] },
    },
    slots: slots(VIVID),
    accent: '#c4500a',
    font: { builtin: 'lexend' },
    sounds: {},
    motion: { style: 'dynamic', revealEffect: null },
    markers: 'icons',
  },
};
