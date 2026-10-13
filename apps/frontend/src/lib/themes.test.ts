import { BUILTIN_THEME_VALUES, GameState } from '@quiz-dock/contracts';
import { describe, expect, it } from 'vitest';
import { themePreviewView } from '../game/theme-preview';
import { builtinValues, isAccessible, themeValuesOf, valuesOfRef } from './themes';
import type { ThemeDto } from '../api/generated/model';

const ID = 'A'.repeat(26);
const mine = {
  id: 't1',
  parent: 'halloween',
  overrides: {
    accent: '#123456',
    slots: { red: { color: '#ff0000', icon: ID } },
  },
  media: {},
  accessibility: { status: 'compliant', checks: [] },
} as unknown as ThemeDto;

describe('theme helpers', () => {
  it('draws a shipped theme with its picture and icons by URL', () => {
    const v = builtinValues('halloween');
    expect(v.background.image).toBe('/themes/halloween.svg');
    expect(v.slots.green.icon).toBe('/icons/bank/halloween/ghost.svg');
  });

  it('draws a library theme over its parent, its own files by their route', () => {
    const v = themeValuesOf(mine);
    expect(v.accent).toBe('#123456');
    expect(v.slots.red).toEqual({ color: '#ff0000', icon: `/api/v1/media/${ID}` });
    expect(v.slots.blue.icon).toBe('/icons/bank/halloween/cat.svg');
  });

  it('resolves a reference, Classic when it is lost', () => {
    expect(valuesOfRef({ id: 't1' }, [mine]).accent).toBe('#123456');
    expect(valuesOfRef({ builtin: 'night' }, []).accent).toBe(BUILTIN_THEME_VALUES.night.accent);
    expect(valuesOfRef({ id: 'gone' }, []).accent).toBe(BUILTIN_THEME_VALUES.classic.accent);
  });

  it('says only of an accessible theme that it is', () => {
    expect(isAccessible(builtinValues('high-contrast-light'))).toBe(true);
    expect(isAccessible(builtinValues('classic'))).toBe(false);
    expect(isAccessible(mine)).toBe(true);
  });
});

describe('theme preview', () => {
  const text = { title: 'Capitals', prompt: 'Capital?' };
  it('plays a game at each moment, in the theme', () => {
    const theme = builtinValues('summer');
    expect(themePreviewView('lobby', theme, text)).toMatchObject({
      state: GameState.Lobby,
      theme,
    });
    const question = themePreviewView('question', theme, text);
    expect(question.question?.options?.map((o) => o.color)).toEqual([
      'green',
      'red',
      'blue',
      'yellow',
    ]);
    expect(themePreviewView('reveal', theme, text).result?.correct).toBe(true);
    expect(themePreviewView('podium', theme, text).podium?.podium).toHaveLength(3);
  });
});
