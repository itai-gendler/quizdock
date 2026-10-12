import { describe, expect, it } from 'vitest';
import {
  DARK_PAGE,
  DEFAULT_LOOK,
  contrast,
  interfaceLookSchema,
  linkOnDark,
  lookAccessibility,
  parseHex,
} from '../src';

describe('interface look', () => {
  it('takes QuizDock’s own look, and refuses what is out of bounds', () => {
    expect(interfaceLookSchema.safeParse(DEFAULT_LOOK).success).toBe(true);
    expect(interfaceLookSchema.safeParse({ ...DEFAULT_LOOK, radius: 'huge' }).success).toBe(false);
    expect(
      interfaceLookSchema.safeParse({
        ...DEFAULT_LOOK,
        showcase: { ...DEFAULT_LOOK.showcase, opacity: 1 },
      }).success,
    ).toBe(false);
  });

  it('reads a look saved before the colour mode as following each device', () => {
    const older: Partial<typeof DEFAULT_LOOK> = { ...DEFAULT_LOOK };
    delete older.colorMode;
    expect(interfaceLookSchema.parse(older).colorMode).toBe('auto');
  });

  it('lightens a link on the dark page until it reads comfortably, the same hue', () => {
    const link = linkOnDark('#2b62ef');
    expect(contrast(parseHex(link), DARK_PAGE)).toBeGreaterThanOrEqual(7);
    expect(linkOnDark('#ffffff')).toBe('#ffffff');
  });

  it('says a look is accessible only when every check passes', () => {
    expect(lookAccessibility(DEFAULT_LOOK).accessible).toBe(true);
    const amber = lookAccessibility({ primary: '#fe9a00', accent: '#2b62ef' });
    expect(amber.accessible).toBe(false);
    expect(amber.checks.find((c) => c.code === 'button_text_contrast')?.passed).toBe(false);
  });
});
