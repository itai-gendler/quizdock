import type { BuiltinTheme, ThemeSlot, ThemeSlotName, ThemeValues } from './theme';

/**
 * The shipped themes (THEMING §2.3). *Classic* is today's rendering, the default: an
 * upgrade changes nothing on screen. Slots list their colours in `OPTION_COLORS` order;
 * a null icon keeps the option's own shape.
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

export const BUILTIN_THEME_VALUES: Record<BuiltinTheme, ThemeValues> = {
  classic: {
    background: { color: '#ffffff', textTone: 'dark' },
    slots: slots(CLASSIC_SLOTS),
    accent: '#2b62ef',
    font: { builtin: 'system' },
    sounds: {},
    motion: { style: 'standard', revealEffect: null },
  },
  sober: {
    background: { color: '#f5f5f4', textTone: 'dark' },
    slots: slots([
      '#b42318',
      '#1d4ed8',
      '#a16207',
      '#15803d',
      '#6d28d9',
      '#ea580c',
      '#be185d',
      '#0f766e',
    ]),
    accent: '#334155',
    font: { builtin: 'inter' },
    sounds: {},
    motion: { style: 'sober', revealEffect: null },
  },
  kids: {
    background: {
      color: '#fff7e0',
      textTone: 'dark',
      gradient: { angle: 160, colors: ['#fff7e0', '#e0f2ff'] },
    },
    slots: slots([
      '#d62828',
      '#1d5fd6',
      '#8a7400',
      '#1f8a3a',
      '#8a2be2',
      '#d95f00',
      '#c2185b',
      '#00796b',
    ]),
    accent: '#d4520a',
    font: { builtin: 'fredoka' },
    sounds: {},
    motion: { style: 'dynamic', revealEffect: null },
  },
  festive: {
    background: {
      color: '#2a0a4a',
      textTone: 'light',
      gradient: { angle: 135, colors: ['#2a0a4a', '#5b1a6e', '#8a1c4a'] },
    },
    slots: slots([
      '#ff4d5e',
      '#4d8dff',
      '#ffc93c',
      '#3ddc84',
      '#c77dff',
      '#ff8c42',
      '#ff5fa2',
      '#2ec4b6',
    ]),
    accent: '#ffc93c',
    font: { builtin: 'nunito' },
    sounds: {},
    motion: { style: 'festive', revealEffect: 'confetti' },
  },
  night: {
    background: { color: '#0f172a', textTone: 'light' },
    slots: slots([
      '#f87171',
      '#60a5fa',
      '#fbbf24',
      '#4ade80',
      '#c084fc',
      '#fb923c',
      '#f472b6',
      '#2dd4bf',
    ]),
    accent: '#38bdf8',
    font: { builtin: 'system' },
    sounds: {},
    motion: { style: 'standard', revealEffect: null },
  },
  'high-contrast': {
    background: { color: '#000000', textTone: 'light' },
    slots: slots([
      '#ff6b6b',
      '#7ab8ff',
      '#ffe14d',
      '#5cff8a',
      '#e0a3ff',
      '#ffa64d',
      '#ff8fd1',
      '#4df0e0',
    ]),
    accent: '#ffe14d',
    font: { builtin: 'atkinson' },
    sounds: {},
    motion: { style: 'sober', revealEffect: null },
  },
  halloween: {
    background: {
      color: '#1a1025',
      textTone: 'light',
      gradient: { angle: 180, colors: ['#1a1025', '#3a1a10'] },
    },
    slots: slots([
      '#ff4040',
      '#6f9bff',
      '#ffd23f',
      '#7bd640',
      '#b06bff',
      '#ff8a1f',
      '#ff6fb5',
      '#3fd0c0',
    ]),
    accent: '#ff8a1f',
    font: { builtin: 'nunito' },
    sounds: {},
    motion: { style: 'festive', revealEffect: null },
  },
  christmas: {
    background: {
      color: '#0b3d2e',
      textTone: 'light',
      gradient: { angle: 180, colors: ['#0b3d2e', '#14261f'] },
    },
    slots: slots([
      '#ff5a5a',
      '#7ab0ff',
      '#ffd166',
      '#9be564',
      '#d19bff',
      '#ff9f5a',
      '#ff7fbf',
      '#5ee0d0',
    ]),
    accent: '#ffd166',
    font: { builtin: 'nunito' },
    sounds: {},
    motion: { style: 'festive', revealEffect: 'confetti' },
  },
  'new-year': {
    background: {
      color: '#0a0f2c',
      textTone: 'light',
      gradient: { angle: 160, colors: ['#0a0f2c', '#1d1446'] },
    },
    slots: slots([
      '#ff5c7a',
      '#6aa8ff',
      '#ffd700',
      '#5fe39a',
      '#c79bff',
      '#ff9e4f',
      '#ff7ac8',
      '#4fd8e0',
    ]),
    accent: '#ffd700',
    font: { builtin: 'lexend' },
    sounds: {},
    motion: { style: 'festive', revealEffect: 'confetti' },
  },
  easter: {
    background: {
      color: '#fdf6ff',
      textTone: 'dark',
      gradient: { angle: 180, colors: ['#fdf6ff', '#f0fff4'] },
    },
    slots: slots([
      '#c2253c',
      '#2f5fc4',
      '#946000',
      '#1f7a3e',
      '#7b3fc4',
      '#d0570b',
      '#b51d6e',
      '#0e6f8a',
    ]),
    accent: '#7b3fc4',
    font: { builtin: 'nunito' },
    sounds: {},
    motion: { style: 'dynamic', revealEffect: null },
  },
  summer: {
    background: {
      color: '#fff4d6',
      textTone: 'dark',
      gradient: { angle: 180, colors: ['#e3f6ff', '#fff4d6'] },
    },
    slots: slots([
      '#d7263d',
      '#1b62c9',
      '#9a6400',
      '#1d7f3b',
      '#7a35c9',
      '#c4500a',
      '#c0186b',
      '#00756a',
    ]),
    accent: '#c4500a',
    font: { builtin: 'lexend' },
    sounds: {},
    motion: { style: 'dynamic', revealEffect: null },
  },
};
