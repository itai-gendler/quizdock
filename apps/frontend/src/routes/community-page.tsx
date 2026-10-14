import { useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CopyPlus, Globe, LayoutGrid, List as ListIcon, SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, twoLineButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Notice } from '@/components/ui/notice';
import { PageTitle } from '@/components/ui/page-title';
import { Pagination } from '@/components/ui/pagination';
import { Segmented } from '@/components/ui/segmented';
import { Select } from '@/components/ui/select';
import { TagFilter, tagsOf } from '@/components/tag-filter';
import { ListSkeleton, LoadFailed } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { useStoredView } from '@/lib/use-stored-view';
import {
  useCommunityControllerList,
  useCommunityControllerTake,
} from '../api/generated/community-store/community-store';
import { getQuizzesControllerListQueryKey } from '../api/generated/quizzes/quizzes';
import { apiErrorText } from '../api/http';
import { useRole } from '../auth/use-role';
import { hasCommunityStore } from '../config';
import { fold } from '@/lib/text';

export function CommunityPage() {
  const { t, i18n } = useTranslation(['store', 'dashboard']);
  const { isHost } = useRole();
  const list = useCommunityControllerList({ query: { enabled: hasCommunityStore() && isHost } });
  const take = useCommunityControllerTake();
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('recent');
  const [view, setView] = useStoredView('quizdock.community.view', 'grid');
  const navigate = useNavigate();
  const client = useQueryClient();
  const entries = useMemo(() => list.data?.data.entries ?? [], [list.data]);
  const allTags = useMemo(() => tagsOf(entries), [entries]);
  const languages = [...new Set(entries.map((e) => e.language))].sort();
  const filtered = entries.filter(
    (e) =>
      (!language || e.language === language) &&
      tags.every((tag) => e.tags.includes(tag)) &&
      fold(`${e.title} ${e.description ?? ''} ${e.author}`).includes(fold(search)),
  );
  filtered.sort((a, b) =>
    sort === 'title'
      ? a.title.localeCompare(b.title, i18n.language)
      : sort === 'questions'
        ? b.questionCount - a.questionCount
        : b.updatedAt.localeCompare(a.updatedAt),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 20));
  const current = Math.min(page, pages);
  const create = async (key: string) => {
    try {
      const { data } = await take.mutateAsync({ data: { key } });
      await client.invalidateQueries({ queryKey: getQuizzesControllerListQueryKey() });
      await navigate({ to: '/quizzes/$quizId', params: { quizId: data.id } });
    } catch {
      /* The mutation's error is displayed below. */
    }
  };
  if (!hasCommunityStore()) return null;
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <Link
          to="/templates"
          className="text-muted-foreground flex w-fit items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          {t('backToCatalogue')}
        </Link>
        <PageTitle>{t('community.title')}</PageTitle>
        <p className="text-muted-foreground max-w-prose text-sm">{t('community.intro')}</p>
      </header>
      {!isHost ? <Notice tone="warning">{t('takeNeedsHost')}</Notice> : null}
      {isHost && list.isPending ? <ListSkeleton variant="grid" rows={6} /> : null}
      {list.isError ? <LoadFailed error={list.error} /> : null}
      {list.data?.data.unavailable.length ? (
        <Notice tone="warning">{t('community.unavailable')}</Notice>
      ) : null}
      {take.error ? (
        <p role="alert" className="text-destructive text-sm">
          {apiErrorText(take.error, t('takeFailed'))}
        </p>
      ) : null}
      {list.isSuccess && !entries.length ? (
        <EmptyState icon={Globe} size="large">
          {t('community.empty')}
        </EmptyState>
      ) : null}
      {entries.length ? (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-[12rem] flex-1">
              <span className="sr-only">{t('search')}</span>
              <Input
                placeholder={t('search')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label className="text-muted-foreground flex flex-col gap-1 text-xs">
              {t('dashboard:filterLanguage')}
              <Select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">{t('dashboard:languageAll')}</option>
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l.toUpperCase()}
                  </option>
                ))}
              </Select>
            </label>
            <label className="text-muted-foreground flex flex-col gap-1 text-xs">
              {t('sortBy')}
              <Select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="recent">{t('sortRecent')}</option>
                <option value="title">{t('sortTitle')}</option>
                <option value="questions">{t('sortQuestions')}</option>
              </Select>
            </label>
            <Segmented
              label={t('dashboard:display')}
              value={view}
              onChange={setView}
              options={[
                { value: 'list', label: t('dashboard:viewList'), icon: ListIcon },
                { value: 'grid', label: t('dashboard:viewGrid'), icon: LayoutGrid },
              ]}
            />
          </div>
          <TagFilter
            label={t('dashboard:filterTags')}
            tags={allTags}
            selected={tags}
            onChange={(next) => {
              setTags(next);
              setPage(1);
            }}
          />
          <p className="text-muted-foreground text-sm" role="status">
            {t('templateCount', { count: filtered.length })}
          </p>
          {!filtered.length ? <EmptyState icon={SearchX}>{t('noMatch')}</EmptyState> : null}
          <ul
            className={
              view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-2'
            }
          >
            {filtered.slice((current - 1) * 20, current * 20).map((entry) => {
              // As a quiz's card in My quizzes: the whole card hovers, its title's link
              // covers it, the action above it its own button.
              const titleLink = (
                <Link
                  to="/community/$key"
                  params={{ key: entry.key }}
                  className="min-w-0 truncate font-semibold after:absolute after:inset-0 after:content-['']"
                >
                  {entry.title}
                </Link>
              );
              const facts = (
                <>
                  <span className="text-muted-foreground flex flex-wrap items-center gap-x-1 text-xs">
                    <span>{t('questionCount', { count: entry.questionCount })}</span>
                    <span>· {entry.language.toUpperCase()}</span>
                    <span>· {entry.author}</span>
                    <span>· {t('licence', { name: entry.license })}</span>
                  </span>
                  <span className="text-muted-foreground text-xs break-all">
                    {t('community.source', { source: entry.id })}
                  </span>
                </>
              );
              const action = (
                <span className="relative z-10 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={twoLineButton}
                    disabled={take.isPending}
                    onClick={() => void create(entry.key)}
                  >
                    <CopyPlus className="size-4 shrink-0" />
                    {t('createFrom')}
                  </Button>
                </span>
              );
              return view === 'grid' ? (
                <li
                  key={entry.key}
                  className="hover:bg-accent/60 relative flex flex-col overflow-hidden rounded-lg border transition-colors"
                >
                  <span className="flex flex-1 flex-col gap-2 p-4">
                    {titleLink}
                    {entry.description ? (
                      <span className="text-muted-foreground line-clamp-2 text-sm">
                        {entry.description}
                      </span>
                    ) : null}
                    <span className="mt-auto flex flex-col gap-1 pt-1">{facts}</span>
                  </span>
                  <span className="flex justify-end border-t p-3">{action}</span>
                </li>
              ) : (
                <li
                  key={entry.key}
                  className="hover:bg-accent/60 relative flex flex-col gap-3 rounded-lg border p-3 transition-colors sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    {titleLink}
                    {facts}
                  </span>
                  {action}
                </li>
              );
            })}
          </ul>
          <Pagination page={current} pages={pages} onChange={setPage} />
        </>
      ) : null}
    </section>
  );
}
