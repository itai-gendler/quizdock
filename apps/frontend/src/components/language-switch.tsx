import { Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover } from '@/components/ui/popover';
import { Select } from '@/components/ui/select';
import { usePersonalLanguage } from '@/lib/personal-language';
import { languageName, nativeName, resolveLang, supportedLngs } from '../i18n/languages';
import { cn } from '@/lib/utils';

/** The account menu's row: the language of this person's interface, the instance's by default. */
export function LanguageMenuRow() {
  const { t, i18n } = useTranslation('auth');
  const { language, set } = usePersonalLanguage();
  return (
    <label className="flex items-center justify-between gap-3 px-2 py-1.5 text-sm">
      <span>{t('nav.language')}</span>
      <Select
        className="h-8 w-auto max-w-48"
        value={language ?? ''}
        onChange={(e) => void set(e.target.value || null)}
      >
        <option value="">
          {t('profile.languageInstance', { name: languageName(resolveLang(), i18n.language) })}
        </option>
        {supportedLngs.map((lang) => (
          <option key={lang} value={lang} lang={lang}>
            {nativeName(lang)}
          </option>
        ))}
      </Select>
    </label>
  );
}

/**
 * A globe in the bar, for someone without an account (and a player in a game): the
 * languages in their own words, the one shown ticked.
 */
export function LanguageGlobe({ className }: { className?: string }) {
  const { t, i18n } = useTranslation('auth');
  const { set } = usePersonalLanguage();
  const shown = i18n.language;
  return (
    <Popover
      align="end"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={t('nav.language')}
          className={cn(
            'hover:bg-accent flex items-center gap-1 rounded-md px-2 py-1 text-sm',
            open && 'bg-accent',
            className,
          )}
        >
          <Globe aria-hidden className="size-4" />
          <span className="uppercase">{shown}</span>
        </button>
      )}
    >
      {(close) => (
        <div role="menu" className="flex max-h-80 min-w-48 flex-col overflow-auto">
          {supportedLngs.map((lang) => (
            <button
              key={lang}
              type="button"
              role="menuitemradio"
              aria-checked={lang === shown}
              lang={lang}
              onClick={() => {
                close();
                void set(lang);
              }}
              className={cn(
                'hover:bg-accent flex items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-sm',
                lang === shown && 'font-medium',
              )}
            >
              {nativeName(lang)}
              {lang === shown ? <Check aria-hidden className="text-primary size-4" /> : null}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
