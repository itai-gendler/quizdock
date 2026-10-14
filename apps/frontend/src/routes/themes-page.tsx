import { BUILTIN_THEMES, type BuiltinTheme, THEME_NAME_MAX } from '@quiz-dock/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Accessibility,
  ChevronDown,
  CopyPlus,
  EllipsisVertical,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Search,
  Sparkles,
  Star,
  Upload,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button, twoLineButton } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { MenuItem } from '@/components/ui/menu-item';
import { SectionTitle } from '@/components/ui/page-title';
import { QuizzesHeader } from '@/components/quizzes-header';
import { Popover } from '@/components/ui/popover';
import { FilterField } from '@/components/ui/filter-field';
import { Select } from '@/components/ui/select';
import { fold } from '@/lib/text';
import { isString, useSessionState } from '@/lib/use-session-state';
import { builtinValues, isAccessible, themeValuesOf } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { useRole } from '../auth/use-role';
import { downloadFile } from '../api/download';
import { apiErrorText } from '../api/http';
import type { ThemeDto } from '../api/generated/model';
import {
  getThemesControllerListQueryKey,
  useThemesControllerDuplicate,
  useThemesControllerImportTheme,
  useThemesControllerList,
  useThemesControllerRemove,
  useThemesControllerSetDefault,
} from '../api/generated/themes/themes';
import { ThemeThumbnail } from '../game/theme-preview';
import { Segmented } from '@/components/ui/segmented';
import { useStoredView } from '@/lib/use-stored-view';
import { useNewTheme } from './use-new-theme';

type Sort = 'recent' | 'title';
const isSort = (v: unknown): v is Sort => v === 'recent' || v === 'title';

/**
 * The library of quiz themes (docs/themes.md): the shipped ones, then the hosts'. Every
 * host uses every theme; its owner and the administrators change it.
 */
export function ThemesPage() {
  const { t } = useTranslation(['themes', 'dashboard']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isManager } = useRole();
  const { data } = useThemesControllerList();
  const list = data?.data;
  const [q, setQ] = useSessionState('quizdock.themes.filter.search', '', isString);
  const [owner, setOwner] = useSessionState('quizdock.themes.filter.owner', '', isString);
  const [sort, setSort] = useSessionState('quizdock.themes.filter.sort', 'recent', isSort);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [view, setView] = useStoredView('quizdock.themes.view', 'grid');
  const [toDelete, setToDelete] = useState<ThemeDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const shippedRef = useRef<HTMLHeadingElement>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: getThemesControllerListQueryKey() });
  const fail = (err: unknown) => setError(apiErrorText(err));
  const { start: newTheme, busy: creating } = useNewTheme(fail);
  const duplicate = useThemesControllerDuplicate();
  const remove = useThemesControllerRemove();
  const setDefault = useThemesControllerSetDefault();
  const importTheme = useThemesControllerImportTheme();

  const defaultRef = list?.defaultTheme ?? { builtin: 'classic' };
  const matches = (name: string, accessible: boolean) =>
    fold(name).includes(fold(q)) && (!accessibleOnly || accessible);
  const shipped = useMemo(
    () =>
      BUILTIN_THEMES.map((key) => ({ key, values: builtinValues(key) })).filter((b) =>
        matches(t(`builtin.${b.key}`), isAccessible(b.values)),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, accessibleOnly, t],
  );
  // Every host uses every theme: everyone's by default, narrowed to one host's on demand.
  const owners = [
    ...new Map((list?.themes ?? []).map((th) => [th.owner.id, th.owner])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name));
  const mine = (list?.themes ?? [])
    .filter((th) => matches(th.name, isAccessible(th)) && (!owner || th.owner.id === owner))
    .sort((a, b) =>
      sort === 'title' ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt),
    );

  const listClass =
    view === 'grid'
      ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : 'flex flex-col gap-2';
  const openEditor = (id: string) =>
    void navigate({ to: '/themes/$themeId', params: { themeId: id } });
  const onImport = (file: File | undefined) => {
    if (!file) return;
    importTheme.mutate(
      { data: { file } },
      {
        onSuccess: (res) => {
          void refresh();
          openEditor(res.data.theme.id);
        },
        onError: fail,
      },
    );
  };
  const onDuplicate = (th: ThemeDto) =>
    duplicate.mutate(
      { id: th.id, data: { name: t('copyName', { name: th.name }).slice(0, THEME_NAME_MAX) } },
      { onSuccess: (res) => (void refresh(), openEditor(res.data.id)), onError: fail },
    );
  const onDefault = (ref: { builtin?: BuiltinTheme; id?: string }) =>
    setDefault.mutate({ data: ref }, { onSuccess: () => void refresh(), onError: fail });

  return (
    <section className="flex flex-col gap-6">
      <QuizzesHeader
        actions={
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              onChange={(e) => {
                onImport(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            {/* As New quiz: blank, from a shipped theme, from a file. */}
            <Popover
              align="end"
              trigger={({ open, toggle }) => (
                <Button
                  onClick={toggle}
                  aria-expanded={open}
                  aria-haspopup="menu"
                  disabled={creating || importTheme.isPending}
                >
                  <Plus className="size-4" />
                  {importTheme.isPending ? t('importing') : t('new')}
                  <ChevronDown className="size-4" />
                </Button>
              )}
            >
              {(close) => (
                <div className="flex min-w-48 flex-col">
                  <MenuItem
                    onClick={() => {
                      close();
                      newTheme('classic');
                    }}
                  >
                    <Plus className="size-4" />
                    {t('newBlank')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      close();
                      shippedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <Sparkles className="size-4" />
                    {t('newFromShipped')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      close();
                      fileRef.current?.click();
                    }}
                  >
                    <Upload className="size-4" />
                    {t('newImport')}
                  </MenuItem>
                </div>
              )}
            </Popover>
          </div>
        }
      />
      <p className="text-muted-foreground max-w-prose text-sm">{t('intro')}</p>

      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        {/* As My quizzes' bar: the search takes the room, the filters follow, the display last. */}
        <div className="flex flex-wrap items-end gap-3">
          <label className="relative min-w-[12rem] flex-1 basis-full sm:basis-auto">
            <span className="sr-only">{t('search')}</span>
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('search')}
              className="pl-8"
            />
          </label>
          {owners.length > 1 ? (
            <FilterField label={t('dashboard:filterOwner')}>
              <Select value={owner} onChange={(e) => setOwner(e.target.value)}>
                <option value="">{t('dashboard:ownerAll')}</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </Select>
            </FilterField>
          ) : null}
          <FilterField label={t('dashboard:sortBy')}>
            <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="recent">{t('dashboard:sortRecent')}</option>
              <option value="title">{t('dashboard:sortTitle')}</option>
            </Select>
          </FilterField>
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
        {/* As My quizzes' tags: the chips on their own line, under the bar. */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={accessibleOnly}
            onClick={() => setAccessibleOnly((v) => !v)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs',
              accessibleOnly && 'bg-primary text-primary-foreground border-transparent',
            )}
          >
            {t('accessibleOnly')}
          </button>
        </div>
      </div>

      <SectionTitle ref={shippedRef} className="scroll-mt-4">
        {t('shipped', { n: shipped.length })}
      </SectionTitle>
      <ul className={listClass}>
        {shipped.map(({ key, values }) => (
          <ThemeCard
            key={key}
            name={t(`builtin.${key}`)}
            meta={t('shippedMeta')}
            values={values}
            accessible={isAccessible(values)}
            isDefault={defaultRef.builtin === key}
            to={key}
            view={view}
            primary={{ label: t('newFrom'), onClick: () => newTheme(key), busy: creating }}
            menu={
              isManager && defaultRef.builtin !== key
                ? [{ label: t('makeDefault'), onClick: () => onDefault({ builtin: key }) }]
                : []
            }
          />
        ))}
      </ul>

      <SectionTitle>{t('library', { n: mine.length })}</SectionTitle>
      {mine.length ? (
        <ul className={listClass}>
          {mine.map((th) => {
            // Refused by the server too; greyed here with its reason (UI system §1.1).
            const why = th.isDefault
              ? t('cannotDelete.default')
              : th.quizCount
                ? t('cannotDelete.used', { count: th.quizCount })
                : null;
            return (
              <ThemeCard
                key={th.id}
                name={th.name}
                meta={t('libraryMeta', {
                  parent: t(`builtin.${th.parent}`),
                  owner: th.owner.name,
                })}
                values={themeValuesOf(th)}
                accessible={isAccessible(th)}
                isDefault={th.isDefault}
                usedIn={th.quizCount}
                to={th.id}
                view={view}
                primary={{ label: t('newFrom'), onClick: () => onDuplicate(th) }}
                menu={[
                  {
                    label: t('export'),
                    onClick: () =>
                      void downloadFile(
                        `/api/v1/themes/${th.id}/export`,
                        'theme.quizdock-theme.zip',
                      ).catch(fail),
                  },
                  ...(isManager && !th.isDefault
                    ? [{ label: t('makeDefault'), onClick: () => onDefault({ id: th.id }) }]
                    : []),
                  ...(th.canEdit
                    ? [
                        {
                          label: t('delete'),
                          destructive: true,
                          disabledReason: why,
                          onClick: () => setToDelete(th),
                        },
                      ]
                    : []),
                ]}
              />
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">
          {q || accessibleOnly ? t('noMatch') : t('noneYet')}
        </p>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title={t('deleteTitle')}
        description={t('deleteText', { name: toDelete?.name ?? '' })}
        confirmLabel={t('delete')}
        destructive
        onCancel={() => setToDelete(null)}
        onConfirm={() =>
          toDelete &&
          remove.mutate(
            { id: toDelete.id },
            {
              onSuccess: () => (setToDelete(null), void refresh()),
              onError: (e) => (setToDelete(null), fail(e)),
            },
          )
        }
      />
    </section>
  );
}

interface MenuEntry {
  label: string;
  onClick: () => void;
  destructive?: boolean;
  /** Greyed, and why. */
  disabledReason?: string | null;
}

function ThemeCard({
  name,
  meta,
  values,
  accessible,
  isDefault,
  usedIn,
  to,
  view,
  primary,
  menu,
}: {
  name: string;
  meta: string;
  values: Parameters<typeof ThemeThumbnail>[0]['theme'];
  accessible: boolean;
  isDefault: boolean;
  usedIn?: number;
  /** The theme's page: a shipped one's key, a library one's id. */
  to: string;
  view: 'grid' | 'list';
  primary?: { label: string; onClick: () => void; busy?: boolean };
  menu: MenuEntry[];
}) {
  const { t } = useTranslation('themes');
  const grid = view === 'grid';
  // The name's link covers the whole card, as a quiz's in My quizzes: one target, the
  // actions above it their own buttons.
  const nameLink = (
    <Link
      to="/themes/$themeId"
      params={{ themeId: to }}
      className="min-w-0 truncate font-semibold after:absolute after:inset-0 after:content-['']"
    >
      {name}
    </Link>
  );
  const facts = (
    <>
      <span className="text-muted-foreground text-xs">{meta}</span>
      <span className="text-muted-foreground flex flex-wrap gap-x-3 text-xs">
        {isDefault ? (
          <span className="text-foreground inline-flex items-center gap-1 font-medium">
            <Star className="size-3.5" />
            {t('isDefault')}
          </span>
        ) : null}
        {usedIn !== undefined ? (
          <span>{usedIn ? t('usedIn', { count: usedIn }) : t('unused')}</span>
        ) : null}
      </span>
    </>
  );
  // The main action at the right, its ⋮ last (UI system §3).
  const actions = (
    <span className="relative z-10 flex items-center gap-2">
      {primary ? (
        <Button
          size="sm"
          variant="outline"
          className={twoLineButton}
          onClick={primary.onClick}
          disabled={primary.busy}
        >
          <CopyPlus className="size-4 shrink-0" />
          {primary.label}
        </Button>
      ) : null}
      {menu.length ? (
        <Popover
          align="end"
          trigger={({ open, toggle }) => (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-expanded={open}
              onClick={toggle}
              aria-label={t('more', { name })}
            >
              <EllipsisVertical className="size-4" />
            </Button>
          )}
        >
          {(close) =>
            menu.map((m) => (
              <div key={m.label}>
                <MenuItem
                  disabled={!!m.disabledReason}
                  destructive={m.destructive}
                  onClick={() => {
                    close();
                    m.onClick();
                  }}
                >
                  {m.label}
                </MenuItem>
                {m.disabledReason ? (
                  <p className="text-muted-foreground max-w-56 px-2 pb-2 text-xs">
                    {m.disabledReason}
                  </p>
                ) : null}
              </div>
            ))
          }
        </Popover>
      ) : (
        // No ⋮: its place kept, so the main actions line up.
        <span className="size-8 shrink-0" aria-hidden />
      )}
    </span>
  );
  return grid ? (
    <li className="hover:bg-accent relative flex flex-col overflow-hidden rounded-lg border transition-colors">
      <ThemeThumbnail theme={values} />
      <span className="flex flex-1 flex-col gap-2 p-4">
        <span className="flex items-start justify-between gap-2">
          {nameLink}
          {accessible ? <AccessibleBadge /> : null}
        </span>
        <span className="mt-auto flex flex-col gap-1 pt-1">{facts}</span>
      </span>
      <span className="flex justify-end border-t p-3">{actions}</span>
    </li>
  ) : (
    <li className="hover:bg-accent relative flex flex-col gap-3 rounded-lg border p-3 transition-colors sm:flex-row sm:items-center sm:gap-4">
      {/* Its look, as the grid shows it, small. */}
      <span className="hidden w-32 shrink-0 overflow-hidden rounded-md border sm:block">
        <ThemeThumbnail theme={values} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex min-w-0 items-center gap-2">
          {nameLink}
          {accessible ? <AccessibleBadge /> : null}
        </span>
        {facts}
      </span>
      {actions}
    </li>
  );
}

/** Only an accessible theme says so; the others carry no mark (docs/themes.md). */
export function AccessibleBadge() {
  const { t } = useTranslation('themes');
  return (
    <Badge variant="success" className="gap-1" title={t('accessibleHint')}>
      <Accessibility className="size-3" />
      {t('accessible')}
    </Badge>
  );
}

/** A link to the library, from where a theme is picked. */
export function ManageThemesLink() {
  const { t } = useTranslation('themes');
  return (
    <Link to="/themes" className="text-link text-xs hover:underline">
      {t('manage')}
    </Link>
  );
}
