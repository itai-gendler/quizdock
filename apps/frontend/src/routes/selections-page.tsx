import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  CopyPlus,
  EllipsisVertical,
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
import { fold } from '@/lib/text';
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

/**
 * The host's selections, and those other hosts share with them (SPECIFICATIONS-SELECTION):
 * named lists of quizzes, launched into a room in one go.
 */
export function SelectionsPage() {
  const { t } = useTranslation('selections');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useSelectionsControllerList();
  const [q, setQ] = useState('');
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

  const list = (data?.data ?? []).filter((s) => fold(s.name).includes(fold(q)));
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
          <div className="relative max-w-sm">
            <Search
              className="text-muted-foreground absolute top-2.5 left-2.5 size-4"
              aria-hidden
            />
            <Input
              className="pl-8"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('search')}
              aria-label={t('search')}
            />
          </div>
          <ul className="flex flex-col gap-2">
            {list.map((s) => (
              <SelectionRow
                key={s.id}
                selection={s}
                launching={isLaunching}
                onPresent={() => void launch({ selectionId: s.id })}
                onCopy={() => onCopy(s)}
                onDelete={() => setToDelete(s)}
              />
            ))}
          </ul>
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
  launching,
  onPresent,
  onCopy,
  onDelete,
}: {
  selection: SelectionDto;
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
    <li className="hover:bg-accent relative flex flex-col gap-3 rounded-lg border p-3 transition-colors sm:flex-row sm:items-center sm:gap-4">
      <span className="flex min-w-0 flex-1 flex-col gap-1">
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
      <span className="relative z-10 flex items-center justify-end gap-2">
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
