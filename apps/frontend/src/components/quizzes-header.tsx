import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/ui/page-title';
import { useRole } from '../auth/use-role';

/**
 * The head of the Quizzes space: its title, the page's actions, and its tabs — what
 * goes into a quiz, in one place: the quizzes, the templates to start from, the themes.
 */
export function QuizzesHeader({ actions }: { actions?: ReactNode }) {
  const { t } = useTranslation(['auth', 'dashboard']);
  const { isManager } = useRole();
  const tabs = [
    { to: '/quizzes', label: isManager ? t('dashboard:allQuizzes') : t('auth:nav.myQuizzes') },
    { to: '/templates', label: t('auth:nav.templates') },
    { to: '/themes', label: t('auth:nav.themes') },
  ] as const;
  return (
    <div className="flex flex-col gap-4">
      {/* As tall as its buttons on every tab: the tabs do not move from one to the next. */}
      <div className="flex min-h-9 flex-wrap items-center justify-between gap-3">
        <PageTitle>{t('auth:nav.quizzes')}</PageTitle>
        {actions}
      </div>
      <nav aria-label={t('auth:nav.quizzes')} className="flex flex-wrap border-b">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: true }}
            className="-mb-px border-b-2 px-3 py-2 text-sm"
            activeProps={{
              className: 'border-primary text-foreground font-medium',
              'aria-current': 'page',
            }}
            inactiveProps={{
              className: 'text-muted-foreground hover:text-foreground border-transparent',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
