import { describe, expect, it } from 'vitest';
import {
  BUILTIN_THEMES,
  BUILTIN_THEME_VALUES,
  backgroundExtremes,
  contrast,
  mergeTheme,
  parseHex,
  textOn,
  themeAccessibility,
  themeMediaIds,
  themeOverridesInput,
  type ThemeValues,
} from '../src';

const ID = (c: string) => c.repeat(26);
const classic = BUILTIN_THEME_VALUES.classic;
const failed = (t: ThemeValues, icons = {}) =>
  themeAccessibility(t, icons)
    .checks.filter((c) => !c.passed)
    .map((c) => c.code);

describe('theme overrides', () => {
  it('takes any subset of the parts, and of the slots', () => {
    expect(themeOverridesInput.safeParse({}).success).toBe(true);
    expect(
      themeOverridesInput.safeParse({
        accent: '#ff6a00',
        slots: { red: { color: '#ff6a00', icon: ID('a') } },
        sounds: { gong: ID('b') },
        motion: { style: 'festive', revealEffect: 'confetti' },
      }).success,
    ).toBe(true);
  });

  it('refuses what is out of bounds or unknown', () => {
    const bad = [
      { accent: 'orange' },
      { slots: { brown: { color: '#000000', icon: null } } },
      { background: { color: '#000000', textTone: 'light', image: ID('a') } },
      {
        background: {
          color: '#000000',
          textTone: 'light',
          image: ID('a'),
          mode: 'cover',
          gradient: { angle: 0, colors: ['#000000', '#ffffff'] },
        },
      },
      { background: { color: '#000000', textTone: 'light', opacity: 2 } },
      { font: { builtin: 'papyrus' } },
      { font: { file: ID('a'), license: 'proprietary' } },
      { sounds: { fanfare: ID('a') } },
      { colour: '#000000' },
    ];
    for (const b of bad)
      expect(themeOverridesInput.safeParse(b).success, JSON.stringify(b)).toBe(false);
  });

  it('merges onto the parent, slot by slot', () => {
    const t = mergeTheme(classic, {
      slots: { red: { color: '#ff6a00', icon: ID('a') } },
      sounds: { gong: ID('b') },
    });
    expect(t.slots.red).toEqual({ color: '#ff6a00', icon: ID('a') });
    expect(t.slots.blue).toEqual(classic.slots.blue);
    expect(t.sounds).toEqual({ gong: ID('b') });
    expect(t.accent).toBe(classic.accent);
  });

  it('lists the media it points to, once', () => {
    expect(
      themeMediaIds({
        background: { color: '#000000', textTone: 'light', image: ID('a'), mode: 'pattern' },
        slots: {
          red: { color: '#ff0000', icon: ID('b') },
          blue: { color: '#0000ff', icon: ID('b') },
        },
        font: { file: ID('c'), license: 'OFL-1.1' },
        sounds: { ding: ID('d') },
      }).sort(),
    ).toEqual([ID('a'), ID('b'), ID('c'), ID('d')]);
  });
});

describe('theme accessibility', () => {
  it('picks the text that reads best on a slot', () => {
    expect(textOn(parseHex('#fe9a00'))).toEqual([0, 0, 0]);
    expect(textOn(parseHex('#155dfc'))).toEqual([1, 1, 1]);
  });

  it('bounds a background by what it may show', () => {
    const plain = backgroundExtremes({ color: '#123456', textTone: 'light' });
    expect(plain[0]).toEqual(plain[1]);
    const [dark, light] = backgroundExtremes({
      color: '#000000',
      textTone: 'light',
      image: ID('a'),
      mode: 'watermark',
      opacity: 0.2,
    });
    expect(dark).toEqual([0, 0, 0]);
    expect(contrast(light, [0, 0, 0])).toBeLessThan(2);
    // A cover with no veil may be any colour: no text is safe on it.
    expect(
      failed({
        ...classic,
        background: { color: '#ffffff', textTone: 'dark', image: ID('a'), mode: 'cover' },
      }),
    ).toContain('text_background_contrast');
  });

  it('every shipped theme is accessible, but Classic', () => {
    for (const key of BUILTIN_THEMES.filter((k) => k !== 'classic'))
      expect(themeAccessibility(BUILTIN_THEME_VALUES[key]).status, key).toBe('compliant');
  });

  it('says where black text would not read', () => {
    const black = mergeTheme(BUILTIN_THEME_VALUES.festive, { slotText: 'dark' });
    expect(failed(black)).toContain('slot_text_contrast');
  });

  it('keeps the white text on every slot, and says where it falls short', () => {
    const a = themeAccessibility(classic);
    expect(a.status).toBe('non_compliant');
    expect(a.checks.find((c) => c.code === 'slot_text_contrast')?.slots).toEqual(
      expect.arrayContaining(['yellow', 'orange']),
    );
  });

  it('flags text that cannot be read as non-compliant', () => {
    const t = { ...classic, background: { color: '#ffffff', textTone: 'light' as const } };
    expect(themeAccessibility(t).status).toBe('non_compliant');
    expect(failed(t)).toContain('text_background_contrast');
  });

  it('flags slots that look alike, and twin icons, as warnings', () => {
    const t = mergeTheme(classic, { slots: { blue: { color: '#e7000c', icon: null } } });
    const a = themeAccessibility(t);
    expect(a.checks.find((c) => c.code === 'slots_distinct')?.passed).toBe(false);
    expect(a.checks.find((c) => c.code === 'slots_distinct')?.slots).toEqual(['red', 'blue']);
    expect(failed(classic, { red: 'x', blue: 'x', green: 'y' })).toContain('icons_distinct');
    expect(failed(classic, { red: 'x', blue: 'y' })).not.toContain('icons_distinct');
  });
});
