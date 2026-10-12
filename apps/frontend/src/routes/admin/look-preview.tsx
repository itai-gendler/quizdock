import { CircleHelp } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Segmented } from '@/components/ui/segmented';
import { BrandLogo } from '@/components/brand-logo';
import { ShowcaseBackdrop } from '@/components/showcase-backdrop';
import { type ResolvedLook, lookVars } from '@/lib/look';
import { cn } from '@/lib/utils';

const PAGES = ['home', 'join', 'login', 'notFound', 'quizzes'] as const;
type Page = (typeof PAGES)[number];

/**
 * The application as a look dresses it (THEMING lot 2): the showcase pages and a
 * working one, light or dark, drawn in a frame with the look's tokens.
 */
export function LookPreview({
  look,
  name,
  logo,
}: {
  look: ResolvedLook;
  /** The branding as it is saved; the header's otherwise. */
  name: string;
  logo?: string;
}) {
  const { t } = useTranslation('admin');
  const [page, setPage] = useState<Page>('home');
  const [dark, setDark] = useState(false);
  return (
    <div className="bg-muted/60 flex min-w-0 flex-col gap-3 rounded-2xl p-4 lg:sticky lg:top-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          size="sm"
          label={t('look.preview.label')}
          value={page}
          onChange={setPage}
          options={PAGES.map((p) => ({ value: p, label: t(`look.preview.${p}`) }))}
        />
        <Segmented
          size="sm"
          label={t('look.preview.label')}
          value={dark ? 'dark' : 'light'}
          onChange={(v) => setDark(v === 'dark')}
          options={[
            { value: 'light', label: t('look.preview.light') },
            { value: 'dark', label: t('look.preview.dark') },
          ]}
        />
      </div>
      <div
        className={cn(
          'bg-background text-foreground flex min-h-[34rem] flex-col overflow-hidden rounded-xl border font-sans shadow-sm',
          dark ? 'dark' : 'light',
        )}
        style={lookVars(look, dark)}
      >
        <PreviewPage page={page} look={look} name={name} logo={logo} />
      </div>
    </div>
  );
}

function PreviewPage({
  page,
  look,
  name,
  logo,
}: {
  page: Page;
  look: ResolvedLook;
  name: string;
  logo?: string;
}) {
  const { t } = useTranslation(['auth', 'common', 'join', 'dashboard', 'admin']);
  const showcase = (children: ReactNode, className?: string) => (
    <main
      className={cn(
        'relative isolate flex flex-1 flex-col items-center gap-6 px-6 py-10',
        className,
      )}
    >
      <ShowcaseBackdrop look={look} logo={logo} contained />
      {children}
    </main>
  );
  const pin = (
    <div className="flex justify-center gap-2">
      {['0', '3', '4', '6', '', ''].map((c, i) => (
        <span
          key={i}
          className="border-input bg-background grid h-12 w-10 place-items-center rounded-md border text-xl font-semibold"
        >
          {c}
        </span>
      ))}
    </div>
  );
  const joinCard = (
    <Card className="w-full max-w-[22rem] p-6 text-center">
      <h2 className="mb-3 font-semibold">{t('auth:landing.joinTitle')}</h2>
      <p className="text-muted-foreground mb-3 text-sm">{t('join:hint')}</p>
      {pin}
      <p className="text-muted-foreground mt-3 text-xs">{t('join:checkedAt6')}</p>
    </Card>
  );
  const nav = (current?: string) => (
    <nav className="flex flex-wrap items-center gap-3 text-sm">
      {(['myQuizzes', 'templates', 'themes'] as const).map((k) => (
        <span
          key={k}
          className={cn(
            k === current && 'text-link font-medium underline decoration-2 underline-offset-[6px]',
          )}
        >
          {t(`auth:nav.${k}`)}
        </span>
      ))}
    </nav>
  );
  const header = (full: boolean, current?: string) => (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
      <span className="flex items-center gap-2 text-lg font-bold">
        {logo ? (
          <img src={logo} alt="" className="h-7 w-auto rounded-md" />
        ) : (
          <BrandLogo className="h-7 w-auto rounded-md" />
        )}
        <span>{name}</span>
      </span>
      {full ? (
        nav(current)
      ) : (
        <span className="text-link text-sm underline">{t('auth:nav.loginLink')}</span>
      )}
    </header>
  );

  switch (page) {
    case 'home':
      return (
        <>
          {header(false)}
          {showcase(
            <>
              <h1 className="text-2xl font-bold tracking-tight">{t('auth:landing.title')}</h1>
              {joinCard}
              <p className="text-muted-foreground text-sm">
                {t('auth:landing.hosting')}{' '}
                <span className="text-link underline">{t('auth:landing.signIn')}</span>
              </p>
            </>,
            'text-center',
          )}
        </>
      );
    case 'join':
      return (
        <>
          {header(false)}
          {showcase(
            <>
              <h1 className="text-2xl font-bold tracking-tight">{t('join:title')}</h1>
              <Card className="w-full max-w-[22rem] p-6">{pin}</Card>
            </>,
            'text-center',
          )}
        </>
      );
    case 'login':
      return (
        <>
          {header(false)}
          {showcase(
            <Card className="flex w-full max-w-[22rem] flex-col gap-3 p-6">
              <h1 className="font-semibold">{t('auth:login.title')}</h1>
              <p className="text-muted-foreground text-sm">{t('auth:login.oidcHint')}</p>
              <Button type="button" tabIndex={-1}>
                {t('auth:login.oidcSubmit')}
              </Button>
            </Card>,
          )}
        </>
      );
    case 'notFound':
      return (
        <>
          {header(true)}
          {showcase(
            <>
              <span className="bg-muted text-muted-foreground grid size-12 place-items-center rounded-full">
                <CircleHelp aria-hidden className="size-6" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight">
                {t('common:fallback.notFoundTitle')}
              </h1>
              <p className="text-muted-foreground">{t('common:fallback.notFoundText')}</p>
              <Button type="button" variant="outline" tabIndex={-1}>
                {t('common:fallback.backHome')}
              </Button>
            </>,
            'gap-4 py-14 text-center',
          )}
        </>
      );
    case 'quizzes':
      return (
        <>
          {header(true, 'myQuizzes')}
          <main className="flex flex-1 flex-col gap-4 px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{t('dashboard:title')}</h1>
              <div className="flex gap-2">
                <Button type="button" variant="outline" tabIndex={-1}>
                  {t('dashboard:import')}
                </Button>
                <Button type="button" tabIndex={-1}>
                  {t('dashboard:newQuiz')}
                </Button>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-primary text-primary-foreground rounded-full px-3 py-1">
                {t('dashboard:statusAll')}
              </span>
              <span className="rounded-full border px-3 py-1">{t('common:quizStatus.ready')}</span>
              <span className="rounded-full border px-3 py-1">{t('common:quizStatus.draft')}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {(['ready', 'draft', 'draft'] as const).map((status, i) => (
                <Card key={i} className="overflow-hidden p-0">
                  <div className="bg-muted aspect-video" />
                  <div className="flex flex-col gap-2 p-4">
                    <span className="bg-muted h-3 w-3/4 rounded" />
                    <Badge variant={status === 'ready' ? 'success' : 'muted'} className="w-fit">
                      {t(`common:quizStatus.${status}`)}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">{t('admin:look.preview.plain')}</p>
          </main>
        </>
      );
  }
}
