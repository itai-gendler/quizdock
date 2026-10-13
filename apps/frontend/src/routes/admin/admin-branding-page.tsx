import { DEFAULT_LOOK, type InterfaceLook, type SettingRow } from '@quiz-dock/contracts';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { BrandLogo } from '@/components/brand-logo';
import { resolveLook } from '@/lib/look';
import { useReadOperation } from './admin-api';
import { LookPreview } from './look-preview';
import { SettingEditor } from './setting-editor';
import { readOnlyReason } from './settings-model';
import { Value } from './settings-page';

/** Who the instance is: the four branding settings, each changed as the Settings page does. */
const KEYS = ['APP_NAME', 'APP_LANG', 'APP_LOGO_URL', 'APP_FEEDBACK_URL'] as const;

/** The administration's Branding space (THEMING lot 2), beside a preview of the app. */
export function AdminBrandingPage() {
  const { t } = useTranslation('admin');
  const list = useReadOperation('settings.list');
  const look = useReadOperation<InterfaceLook>('look.get');
  const data = list.data?.data;
  if (!data) return null;
  const row = (key: string) => data.rows.find((r) => r.key === key);
  const name = String(row('APP_NAME')?.value ?? '') || 'QuizDock';
  const logo = String(row('APP_LOGO_URL')?.value ?? '') || undefined;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground max-w-prose text-sm">{t('branding.intro')}</p>
      <div className="grid items-start gap-x-8 gap-y-4 lg:grid-cols-[26rem_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          {KEYS.map((key) => {
            const r = row(key);
            return r ? (
              <BrandingCard key={key} row={r} access={data.access}>
                {key === 'APP_LOGO_URL' ? (
                  <div className="flex items-center gap-3">
                    {logo ? (
                      <img src={logo} alt="" className="size-14 rounded-lg border object-contain" />
                    ) : (
                      <BrandLogo className="size-14 rounded-lg border object-contain" />
                    )}
                    <p className="text-muted-foreground text-xs">
                      {logo ? null : `${t('branding.logoDefault')} `}
                      {t('branding.APP_LOGO_URL_hint')}
                    </p>
                  </div>
                ) : null}
              </BrandingCard>
            ) : null;
          })}
          <section className="bg-muted/40 flex flex-col gap-1 rounded-xl border p-4">
            <h3 className="font-semibold">{t('branding.css')}</h3>
            <p className="text-sm">{t('branding.cssHint')}</p>
          </section>
        </div>
        <LookPreview look={resolveLook(look.data?.data ?? DEFAULT_LOOK)} name={name} logo={logo} />
      </div>
    </div>
  );
}

function BrandingCard({
  row,
  access,
  children,
}: {
  row: SettingRow;
  access: Parameters<typeof SettingEditor>[0]['access'];
  children?: React.ReactNode;
}) {
  const { t } = useTranslation('admin');
  const reason = readOnlyReason(row, access, false);
  return (
    <section className="bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">{t(`branding.${row.key}`)}</h3>
        <Badge variant="muted">{t(`source.${row.source}`)}</Badge>
      </div>
      {children}
      {reason ? (
        <>
          <span className="text-sm font-medium">
            <Value row={row} value={row.value} />
          </span>
          <Badge variant="muted" className="w-fit gap-1">
            <Lock aria-hidden className="size-3" />
            {t(`readOnly.${reason}`)}
          </Badge>
        </>
      ) : (
        // Keyed by the setting: a save reads the row again without remounting its editor.
        <SettingEditor key={row.key} row={row} access={access} />
      )}
      <p className="text-muted-foreground text-xs">
        {row.key === 'APP_LOGO_URL' ? null : `${t(`branding.${row.key}_hint`)} `}
        <code>{row.key}</code>
      </p>
    </section>
  );
}
