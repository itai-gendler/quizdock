import type { ThemeValues } from '@quiz-dock/contracts';
import { createContext, useContext, useMemo } from 'react';
import { useThemesControllerList } from '../api/generated/themes/themes';
import { valuesOfRef } from './themes';

/**
 * The theme of the quiz being edited, for its previews: they show the quiz as the room
 * will see it (docs/themes.md). Null outside a quiz, or until the themes are read.
 */
const QuizThemeContext = createContext<ThemeValues | null>(null);
export const QuizThemeProvider = QuizThemeContext.Provider;
export const useQuizTheme = () => useContext(QuizThemeContext);

/** A quiz's theme: its own, else the instance's default (Classic when lost). */
export function useQuizThemeValues(
  quiz: { themeId?: string | null; themeBuiltin?: string | null } | null | undefined,
): ThemeValues | null {
  const { data } = useThemesControllerList();
  const list = data?.data;
  const themeId = quiz?.themeId ?? null;
  const themeBuiltin = quiz?.themeBuiltin ?? null;
  const known = !!quiz;
  return useMemo(() => {
    if (!list || !known) return null;
    const ref = themeId
      ? { id: themeId }
      : themeBuiltin
        ? { builtin: themeBuiltin }
        : list.defaultTheme;
    return valuesOfRef(ref, list.themes);
  }, [list, known, themeId, themeBuiltin]);
}
