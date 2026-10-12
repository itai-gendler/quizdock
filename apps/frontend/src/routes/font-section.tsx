import { FONT_LICENSES, THEME_FONTS, type ThemeOverrides } from '@quiz-dock/contracts';
import { type ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Disclosure } from '@/components/ui/disclosure';
import { Select } from '@/components/ui/select';

/**
 * A font, for a quiz theme and for the instance's look: a shipped one (OFL), or an
 * imported woff2 with its licence.
 */
export function FontSection({
  font,
  origin,
  onChange,
  onUpload,
  rememberAs = 'theme-font',
}: {
  font: ThemeOverrides['font'] & object;
  origin?: ReactNode;
  rememberAs?: string;
  onChange: (f: NonNullable<ThemeOverrides['font']>) => void;
  onUpload: (file: File, license: (typeof FONT_LICENSES)[number]) => void;
}) {
  const { t } = useTranslation('themes');
  const [license, setLicense] = useState<(typeof FONT_LICENSES)[number]>('OFL-1.1');
  const fileRef = useRef<HTMLInputElement>(null);
  const current = 'builtin' in font ? font.builtin : 'own';
  return (
    <Disclosure
      title={t('editor.font')}
      rememberAs={rememberAs}
      value={current === 'own' ? t('editor.ownFont') : t(`font.${current}`)}
    >
      {origin}
      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium">{t('editor.font')}</span>
        <Select
          className="h-8 w-auto"
          value={current}
          onChange={(e) =>
            e.target.value !== 'own' &&
            onChange({ builtin: e.target.value as (typeof THEME_FONTS)[number] })
          }
        >
          {THEME_FONTS.map((f) => (
            <option key={f} value={f}>
              {t(`font.${f}`)}
            </option>
          ))}
          {current === 'own' ? <option value="own">{t('editor.ownFont')}</option> : null}
        </Select>
      </label>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <input
          ref={fileRef}
          type="file"
          accept=".woff2,font/woff2"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f, license);
            e.target.value = '';
          }}
        />
        <Select
          className="h-8 w-auto"
          value={license}
          aria-label={t('editor.fontLicense')}
          onChange={(e) => setLicense(e.target.value as (typeof FONT_LICENSES)[number])}
        >
          {FONT_LICENSES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          {t('editor.fontUpload')}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">{t('editor.fontHint')}</p>
    </Disclosure>
  );
}
