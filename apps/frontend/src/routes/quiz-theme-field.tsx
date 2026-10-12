import { BUILTIN_THEMES } from '@quiz-dock/contracts';
import { useTranslation } from 'react-i18next';
import { Disclosure } from '@/components/ui/disclosure';
import {
  builtinValues,
  isAccessible,
  isBuiltinKey,
  themeValuesOf,
  valuesOfRef,
} from '@/lib/themes';
import { cn } from '@/lib/utils';
import { useThemesControllerList } from '../api/generated/themes/themes';
import type { ThemeValues } from '@quiz-dock/contracts';
import { ThemeThumbnail } from '../game/theme-preview';
import { AccessibleBadge, ManageThemesLink } from './themes-page';

/** A quiz's theme as the API says it: a library theme, a shipped one, or neither (the default). */
export interface QuizThemeValue {
  themeId: string | null;
  themeBuiltin: string | null;
}

/**
 * The quiz's look on the live screens (THEMING §2.7): a thumbnail per theme, the
 * instance's default first, then the shipped themes, then the hosts'. Only the
 * accessible ones say so.
 */
export function QuizThemeField({
  value,
  disabled,
  onChange,
}: {
  value: QuizThemeValue;
  disabled?: boolean;
  onChange: (theme: { builtin?: string; id?: string } | null) => void;
}) {
  const { t } = useTranslation('themes');
  const { data } = useThemesControllerList();
  const library = data?.data.themes ?? [];
  const defaultRef = data?.data.defaultTheme ?? { builtin: 'classic' };
  const defaultName = defaultRef.id
    ? (library.find((th) => th.id === defaultRef.id)?.name ?? '')
    : t(`builtin.${isBuiltinKey(defaultRef.builtin) ? defaultRef.builtin : 'classic'}`);
  const current: string = value.themeId ?? value.themeBuiltin ?? '';
  const currentName = value.themeId
    ? (library.find((th) => th.id === value.themeId)?.name ?? '')
    : value.themeBuiltin
      ? t(`builtin.${value.themeBuiltin}`)
      : t('picker.default', { name: defaultName });
  const currentValues = valuesOfRef(
    value.themeId
      ? { id: value.themeId }
      : value.themeBuiltin
        ? { builtin: value.themeBuiltin }
        : defaultRef,
    library,
  );

  const choices: {
    key: string;
    label: string;
    values: ThemeValues;
    ref: { builtin?: string; id?: string } | null;
  }[] = [
    {
      key: '',
      label: t('picker.default', { name: defaultName }),
      values: valuesOfRef(defaultRef, library),
      ref: null,
    },
    ...BUILTIN_THEMES.map((k) => ({
      key: k,
      label: t(`builtin.${k}`),
      values: builtinValues(k),
      ref: { builtin: k },
    })),
    ...library.map((th) => ({
      key: th.id,
      label: th.name,
      values: themeValuesOf(th),
      ref: { id: th.id },
    })),
  ];

  return (
    <Disclosure
      flush
      className="-mx-3 border-t px-3 pt-1"
      title={t('picker.legend')}
      rememberAs="quiz-theme"
      value={`${currentName}${isAccessible(currentValues) ? ` · ${t('accessible').toLowerCase()}` : ''}`}
    >
      <div className="flex flex-col gap-2">
        {isAccessible(currentValues) ? <AccessibleBadge /> : null}
        <div
          role="radiogroup"
          aria-label={t('picker.legend')}
          className="grid max-h-[26rem] grid-cols-2 gap-2 overflow-auto pr-1 sm:grid-cols-3"
        >
          {choices.map((c) => (
            <button
              key={c.key || 'default'}
              type="button"
              role="radio"
              aria-checked={current === c.key}
              disabled={disabled}
              onClick={() => onChange(c.ref)}
              className={cn(
                'overflow-hidden rounded-md border text-left text-xs',
                current === c.key ? 'ring-primary ring-2' : 'hover:ring-primary/50 hover:ring-1',
              )}
            >
              <ThemeThumbnail theme={c.values} />
              <span className="flex items-center justify-between gap-1 px-2 py-1">
                <span className="truncate">{c.label}</span>
              </span>
            </button>
          ))}
        </div>
        <ManageThemesLink />
      </div>
    </Disclosure>
  );
}
