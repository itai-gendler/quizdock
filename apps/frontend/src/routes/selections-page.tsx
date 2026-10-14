import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  CopyPlus,
  EllipsisVertical,
  LayoutGrid,
  List as ListIcon,
  ListOrdered,
  Lock,
  Play,
  Plus,
  Search,
  Share2,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, twoLineButton } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { ListSkeleton } from '@/components/ui/loading';
import { MenuItem } from '@/components/ui/menu-item';
import { Popover } from '@/components/ui/popover';
import { QuizzesHeader } from '@/components/quizzes-header';
import { FilterField } from '@/components/ui/filter-field';
import { Segmented } from '@/components/ui/segmented';
import { Select } from '@/components/ui/select';
import { fold } from '@/lib/text';
import { isString, useSessionState } from '@/lib/use-session-state';
import { useStoredView } from '@/lib/use-stored-view';
import { cn } from '@/lib/utils';
import { apiErrorText } from '../api/http';
import type { SelectionDto } from '../api/generated/model';
import {
  getSelectionsControllerListQueryKey,
  useSelectionsControllerCreate,
  useSelectionsControllerDuplicate,
  useSelectionsControllerList,
  useSelectionsControllerRemove,
} from '../api/generated/selections/selections';
import { useLaunchSession } from '../game/use-launch-session';
import { SelectionFan } from './selection-fan';

/** Where the list's filters are kept for the tab's visit. */
const FILTERS = 'quizdock.selections.filter';
/** The owner filter's value for the caller's own selections (never a name). */
const ME = '\u0000me';
type Sort = 'recent' | 'title';
const isSort = (v: unknown): v is Sort => v === 'recent' || v === 'title';

/**
 * The host's selections, and those other hosts share with them (SPECIFICATIONS-SELECTION):
 * named lists of quizzes, launched into a room in one go.
 */
export function SelectionsPage() {
  const { t } = useTranslation(['selections', 'dashboard']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useSelectionsControllerList();
  // As My quizzes: one's own first, filters kept for the tab's visit, list or grid.
  const [q, setQ] = useSessionState(`${FILTERS}.search`, '', isString);
  const [owner, setOwner] = useSessionState(`${FILTERS}.owner`, ME, isString);
  const [sort, setSort] = useSessionState(`${FILTERS}.sort`, 'recent', isSort);
  const [view, setView] = useStoredView('quizdock.selections.view');
  const [toDelete, setToDelete] = useState<SelectionDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const create = useSelectionsControllerCreate();
  const duplicate = useSelectionsControllerDuplicate();
  const remove = useSelectionsControllerRemove();
  const { launch, isLaunching, error: launchError, dialog: launchDialog } = useLaunchSession();

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: getSelectionsControllerListQueryKey() });
  const fail = (err: unknown) => setError(apiErrorText(err));
  const open = (id: string) =>
    void navigate({ to: '/selections/$selectionId', params: { selectionId: id } });
  const onNew = () =>
    create.mutate(
      { data: { name: t('newName') } },
      { onSuccess: (res) => (void refresh(), open(res.data.id)), onError: fail },
    );
  const onCopy = (s: SelectionDto) =>
    duplicate.mutate(
      { id: s.id },
      { onSuccess: (res) => (void refresh(), open(res.data.id)), onError: fail },
    );

  const all = data?.data ?? [];
  const others = [
    ...new Set(all.flatMap((s) => (!s.editable && s.ownerName ? [s.ownerName] : []))),
  ].sort((a, b) => a.localeCompare(b));
  const list = all
    .filter(
      (s) =>
        fold(s.name).includes(fold(q)) &&
        (!owner || (s.editable ? ME : (s.ownerName ?? '')) === owner),
    )
    .sort((a, b) =>
      sort === 'title' ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt),
    );
  const newButton = (
    <Button type="button" onClick={onNew} disabled={create.isPending}>
      <Plus className="size-4" />
      {t('new')}
    </Button>
  );

  return (
    <section className="flex flex-col gap-6">
      <QuizzesHeader actions={newButton} />
      <p className="text-muted-foreground max-w-(--container-content-sm) text-sm">{t('intro')}</p>
      {error || launchError ? (
        <p className="text-destructive text-sm" role="alert">
          {error ?? launchError}
        </p>
      ) : null}
      {isLoading ? (
        <ListSkeleton variant="list" />
      ) : (data?.data ?? []).length === 0 ? (
        <EmptyState icon={ListOrdered} size="large" title={t('emptyTitle')} action={newButton}>
          {t('empty')}
        </EmptyState>
      ) : (
        <>
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
            {others.length > 0 ? (
              <FilterField label={t('dashboard:filterOwner')}>
                <Select value={owner} onChange={(e) => setOwner(e.target.value)}>
                  <option value={ME}>{t('dashboard:ownerMe')}</option>
                  {others.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                  <option value="">{t('dashboard:ownerAll')}</option>
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
          {list.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t('noMatch')}</p>
          ) : (
            <ul
              className={
                view === 'grid'
                  ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'flex flex-col gap-2'
              }
            >
              {list.map((s) => (
                <SelectionRow
                  key={s.id}
                  selection={s}
                  grid={view === 'grid'}
                  launching={isLaunching}
                  onPresent={() => void launch({ selectionId: s.id })}
                  onCopy={() => onCopy(s)}
                  onDelete={() => setToDelete(s)}
                />
              ))}
            </ul>
          )}
        </>
      )}
      {launchDialog}
      <ConfirmDialog
        open={toDelete !== null}
        destructive
        title={t('deleteConfirm.title')}
        description={t('deleteConfirm.description', { name: toDelete?.name ?? '' })}
        confirmLabel={t('delete')}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          const target = toDelete;
          setToDelete(null);
          if (target)
            remove.mutate({ id: target.id }, { onSuccess: () => void refresh(), onError: fail });
        }}
      />
    </section>
  );
}

function SelectionRow({
  selection: s,
  grid,
  launching,
  onPresent,
  onCopy,
  onDelete,
}: {
  selection: SelectionDto;
  /** A card of the grid, its actions at its foot; otherwise a line, its actions at its right. */
  grid: boolean;
  launching: boolean;
  onPresent: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation('selections');
  const others = !s.editable;
  return (
    // As a quiz's line in My quizzes: the whole card hovers, its title's link covers it,
    // the actions above it stay their own buttons.
    <li
      className={cn(
        'group hover:bg-accent/60 relative flex flex-col overflow-hidden rounded-lg border transition-colors',
        grid ? '' : 'gap-3 p-3 sm:flex-row sm:items-center sm:gap-4',
      )}
    >
      {/* Its first quizzes fanned out, as a quiz's card shows its first step. */}
      {grid ? (
        <SelectionFan preview={s.preview} />
      ) : (
        <SelectionFan
          preview={s.preview}
          className="hidden w-32 shrink-0 rounded-md border sm:block"
        />
      )}
      <span className={cn('flex min-w-0 flex-1 flex-col gap-1', grid && 'p-4')}>
        <span className="flex min-w-0 items-center gap-2">
          {others ? (
            <Lock className="text-muted-foreground size-3.5 shrink-0" aria-label={t('readOnly')} />
          ) : null}
          <Link
            to="/selections/$selectionId"
            params={{ selectionId: s.id }}
            className="min-w-0 truncate font-semibold after:absolute after:inset-0 after:content-['']"
          >
            {s.name}
          </Link>
        </span>
        <span className="text-muted-foreground flex flex-wrap gap-x-2 text-xs">
          <span>{t('quizCount', { count: s.quizCount })}</span>
          {s.playableCount < s.quizCount ? (
            <span>· {t('playableCount', { count: s.playableCount })}</span>
          ) : null}
          {others ? <span>· {t('ownedBy', { name: s.ownerName ?? '' })}</span> : null}
          {s.shared && !others ? (
            <span className="inline-flex items-center gap-1">
              · <Share2 className="size-3" aria-hidden />
              {t('sharedMark')}
            </span>
          ) : null}
        </span>
      </span>
      {/* The main action at the right, its ⋮ last. */}
      <span
        className={cn('relative z-10 flex items-center justify-end gap-2', grid && 'border-t p-3')}
      >
        {others ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={twoLineButton}
            onClick={onCopy}
          >
            <CopyPlus className="size-4 shrink-0" />
            {t('createFrom')}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="main-action"
          disabled={launching || s.playableCount === 0}
          onClick={onPresent}
        >
          <Play className="size-4" />
          {t('present')}
        </Button>
        {others ? (
          // No ⋮ on another host's: its place kept, so the main actions line up.
          <span className="size-8 shrink-0" aria-hidden />
        ) : (
          <Popover
            align="end"
            trigger={({ toggle }) => (
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={toggle}
                aria-label={t('actions', { name: s.name })}
              >
                <EllipsisVertical className="size-4" />
              </Button>
            )}
          >
            {(close) => (
              <MenuItem
                destructive
                onClick={() => {
                  close();
                  onDelete();
                }}
              >
                {t('delete')}
              </MenuItem>
            )}
          </Popover>
        )}
      </span>
    </li>
  );
}
