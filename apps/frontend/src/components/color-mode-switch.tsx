import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Segmented } from '@/components/ui/segmented';
import { useColorMode } from '@/lib/color-mode';

/**
 * Light, dark, or as the system says, for this device (THEMING lot 3). Absent when the
 * instance forces one.
 */
export function ColorModeSwitch() {
  const { t } = useTranslation('auth');
  const { pref, forced, set } = useColorMode();
  if (forced !== 'auto') return null;
  return (
    <div className="flex items-center justify-between gap-3 px-2 py-1.5 text-sm">
      <span>{t('nav.appearance')}</span>
      <Segmented
        size="sm"
        label={t('nav.appearance')}
        value={pref}
        onChange={set}
        options={[
          { value: 'auto', label: t('nav.colorMode.auto'), icon: Monitor },
          { value: 'light', label: t('nav.colorMode.light'), icon: Sun },
          { value: 'dark', label: t('nav.colorMode.dark'), icon: Moon },
        ]}
      />
    </div>
  );
}
