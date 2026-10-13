import type { BuiltinTheme } from '@quiz-dock/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, CopyPlus, EllipsisVertical, Star } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/components/ui/menu-item';
import { PageTitle } from '@/components/ui/page-title';
import { Popover } from '@/components/ui/popover';
import { builtinValues, isAccessible } from '@/lib/themes';
import { apiErrorText } from '../api/http';
import {
  getThemesControllerListQueryKey,
  useThemesControllerList,
  useThemesControllerSetDefault,
} from '../api/generated/themes/themes';
import { useRole } from '../auth/use-role';
import { ThemePreviewPanel } from '../game/theme-preview';
import { AccessibleBadge } from './themes-page';
import { useNewTheme } from './use-new-theme';

/**
 * A theme shipped with QuizDock, read-only, as a template is: seen at work, and the way
 * to a theme of one's own from it.
 */
export function BuiltinThemePage({ themeKey }: { themeKey: BuiltinTheme }) {
  const { t } = useTranslation('themes');
  const queryClient = useQueryClient();
  const { isHost, isManager } = useRole();
  const [error, setError] = useState<string | null>(null);
  const fail = (err: unknown) => setError(apiErrorText(err));
  const { start, busy } = useNewTheme(fail);
  const list = useThemesControllerList();
  const setDefault = useThemesControllerSetDefault();
  const values = builtinValues(themeKey);
  const isDefault = (list.data?.data.defaultTheme ?? { builtin: 'classic' }).builtin === themeKey;

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Link to="/themes" className="text-muted-foreground flex w-fit items-center gap-1 text-sm">
          <ArrowLeft className="size-4" />
          {t('title')}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <PageTitle>{t(`builtin.${themeKey}`)}</PageTitle>
            {isAccessible(values) ? <AccessibleBadge /> : null}
          </div>
          <div className="flex items-center gap-2">
            {isHost ? (
              <Button type="button" onClick={() => start(themeKey)} disabled={busy}>
                <CopyPlus className="size-4" />
                {t('newFrom')}
              </Button>
            ) : null}
            {isManager && !isDefault ? (
              <Popover
                align="end"
                trigger={({ open, toggle }) => (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t('more', { name: t(`builtin.${themeKey}`) })}
                    aria-expanded={open}
                    onClick={toggle}
                  >
                    <EllipsisVertical className="size-4" />
                  </Button>
                )}
              >
                {(close) => (
                  <MenuItem
                    onClick={() => {
                      close();
                      setDefault.mutate(
                        { data: { builtin: themeKey } },
                        {
                          onSuccess: () =>
                            void queryClient.invalidateQueries({
                              queryKey: getThemesControllerListQueryKey(),
                            }),
                          onError: fail,
                        },
                      );
                    }}
                  >
                    {t('makeDefault')}
                  </MenuItem>
                )}
              </Popover>
            ) : null}
          </div>
        </div>
        <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-sm">
          <span>{t('shippedMeta')}</span>
          {isDefault ? (
            <span className="text-foreground inline-flex items-center gap-1 font-medium">
              <Star className="size-3.5" />
              {t('isDefault')}
            </span>
          ) : null}
        </p>
        {error ? (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        ) : null}
      </header>
      <ThemePreviewPanel theme={values} />
    </section>
  );
}
