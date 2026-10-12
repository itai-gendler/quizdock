import {
  BUILTIN_THEMES,
  BUILTIN_THEME_VALUES,
  type BuiltinTheme,
  type ThemeOverrides,
  type ThemeValues,
  mergeTheme,
  themeAccessibility,
  themeMediaIds,
  themeWithUrls,
} from '@quiz-dock/contracts';
import { mediaUrl } from './media-url';
import type { ThemeDto } from '../api/generated/model';

/** A quiz's theme, or the instance's default: a shipped one by its key, or one of the library. */
export interface ThemeRef {
  builtin?: string;
  id?: string;
}

export const isBuiltinKey = (key: string | null | undefined): key is BuiltinTheme =>
  !!key && (BUILTIN_THEMES as readonly string[]).includes(key);

/** A library theme as the live screens would draw it: its parent's values under its overrides. */
export function themeValuesOf(
  theme: Pick<ThemeDto, 'parent' | 'overrides' | 'media'>,
): ThemeValues {
  const values = mergeTheme(
    BUILTIN_THEME_VALUES[theme.parent as BuiltinTheme],
    theme.overrides as ThemeOverrides,
  );
  // Every file by its route: one just uploaded is not in `media` yet.
  return themeWithUrls(
    values,
    Object.fromEntries(
      themeMediaIds(theme.overrides as ThemeOverrides).map((id) => [
        id,
        theme.media[id]?.url ?? mediaUrl(id),
      ]),
    ),
  );
}

/** A shipped theme as the live screens would draw it (its icons and picture by URL). */
export const builtinValues = (key: BuiltinTheme): ThemeValues =>
  themeWithUrls(BUILTIN_THEME_VALUES[key], {});

/** What a reference points to, among the shipped themes and the library; Classic when lost. */
export function valuesOfRef(ref: ThemeRef | null | undefined, library: ThemeDto[]): ThemeValues {
  if (ref?.id) {
    const found = library.find((t) => t.id === ref.id);
    if (found) return themeValuesOf(found);
  }
  return builtinValues(isBuiltinKey(ref?.builtin) ? ref.builtin : 'classic');
}

/** Whether a theme passes every accessibility check: only those say so (THEMING §1.2). */
export function isAccessible(theme: ThemeValues | ThemeDto): boolean {
  if ('accessibility' in theme) return theme.accessibility.status === 'compliant';
  return themeAccessibility(theme).status === 'compliant';
}
