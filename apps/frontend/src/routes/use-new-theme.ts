import type { BuiltinTheme } from '@quiz-dock/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  getThemesControllerListQueryKey,
  useThemesControllerCreate,
} from '../api/generated/themes/themes';

/**
 * A new theme from a shipped one, at once: "My <parent>", opened in its editor, where
 * it is renamed in place. No dialog to fill first.
 */
export function useNewTheme(onError: (err: unknown) => void) {
  const { t } = useTranslation('themes');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const create = useThemesControllerCreate();
  const start = (parent: BuiltinTheme) =>
    create.mutate(
      { data: { name: t('newName', { parent: t(`builtin.${parent}`) }), parent, overrides: {} } },
      {
        onSuccess: (res) => {
          void queryClient.invalidateQueries({ queryKey: getThemesControllerListQueryKey() });
          void navigate({ to: '/themes/$themeId', params: { themeId: res.data.id } });
        },
        onError,
      },
    );
  return { start, busy: create.isPending };
}
