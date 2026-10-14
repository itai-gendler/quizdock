import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowDown, ArrowLeft, ArrowUp, CopyPlus, ListPlus, Play, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, twoLineButton } from '@/components/ui/button';
import { CheckboxField } from '@/components/ui/checkbox-field';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadFailed, PageLoading } from '@/components/ui/loading';
import { PageTitle, SectionTitle } from '@/components/ui/page-title';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { apiErrorText } from '../api/http';
import type { SelectionDetailDto, SelectionDetailDtoItemsItem } from '../api/generated/model';
import { useQuizzesControllerList } from '../api/generated/quizzes/quizzes';
import {
  getSelectionsControllerGetQueryKey,
  getSelectionsControllerListQueryKey,
  useSelectionsControllerDuplicate,
  useSelectionsControllerGet,
  useSelectionsControllerLaunches,
  useSelectionsControllerUpdate,
} from '../api/generated/selections/selections';
import { QuizPicker } from '../game/room-components';
import { useLaunchSession } from '../game/use-launch-session';
import { selectionRoute } from '../router';

/** At most this many quizzes in a selection (the server says so too). */
const ITEMS_MAX = 50;

type Item = SelectionDetailDtoItemsItem;

/**
 * A selection (SPECIFICATIONS-SELECTION): its owner edits it — name, description,
 * sharing, its quizzes in order with their pace — and sees its launches compared;
 * another host it is shared with reads it, launches it, or creates their own from it.
 */
export function SelectionPage() {
  const { t } = useTranslation('selections');
  const { selectionId } = selectionRoute.useParams();
  const { data, error, isLoading, refetch } = useSelectionsControllerGet(selectionId);
  if (isLoading) return <PageLoading />;
  const selection = data?.data;
  if (!selection) {
    return <LoadFailed error={error} notFound={t('notFound')} onRetry={() => void refetch()} />;
  }
  return selection.editable ? (
    <SelectionEditor selection={selection} />
  ) : (
    <SelectionReadOnly selection={selection} />
  );
}

function BackLink() {
  const { t } = useTranslation('selections');
  return (
    <Link to="/selections" className="text-muted-foreground inline-flex items-center gap-1 text-sm">
      <ArrowLeft className="size-4" />
      {t('back')}
    </Link>
  );
}

function PresentButton({ selection }: { selection: SelectionDetailDto }) {
  const { t } = useTranslation('selections');
  const { launch, isLaunching, error, dialog } = useLaunchSession();
  return (
    <>
      <Button
        type="button"
        variant="main-action"
        disabled={isLaunching || selection.playableCount === 0}
        onClick={() => void launch({ selectionId: selection.id })}
      >
        <Play className="size-4" />
        {t('present')}
      </Button>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {dialog}
    </>
  );
}

function SelectionEditor({ selection }: { selection: SelectionDetailDto }) {
  const { t } = useTranslation('selections');
  const queryClient = useQueryClient();
  const update = useSelectionsControllerUpdate();
  const [name, setName] = useState(selection.name);
  const [description, setDescription] = useState(selection.description ?? '');
  const [items, setItems] = useState<Item[]>(selection.items);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => setItems(selection.items), [selection.items]);

  const save = (data: Parameters<typeof update.mutate>[0]['data']) =>
    update.mutate(
      { id: selection.id, data },
      {
        onSuccess: (res) => {
          setError(null);
          queryClient.setQueryData(getSelectionsControllerGetQueryKey(selection.id), res);
          void queryClient.invalidateQueries({ queryKey: getSelectionsControllerListQueryKey() });
        },
        onError: (err) => {
          setError(apiErrorText(err));
          setItems(selection.items); // back to what is saved
        },
      },
    );
  const saveItems = (next: Item[]) => {
    setItems(next);
    save({
      items: next.map((i) => ({ quizId: i.quizId, mode: i.mode, autoStart: i.autoStart })),
    });
  };
  const move = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    saveItems(next);
  };
  const change = (index: number, patch: Partial<Item>) =>
    saveItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <section className="flex flex-col gap-6">
      <BackLink />
      <header className="flex flex-wrap items-start justify-between gap-3">
        <Input
          className="h-auto max-w-xl border-none px-0 text-2xl font-semibold shadow-none"
          value={name}
          maxLength={60}
          aria-label={t('name')}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          onBlur={() => {
            const trimmed = name.trim();
            if (!trimmed) return setName(selection.name); // a name emptied comes back
            if (trimmed !== selection.name) save({ name: trimmed });
          }}
        />
        <PresentButton selection={selection} />
      </header>
      <Textarea
        className="max-w-(--container-content-sm)"
        value={description}
        maxLength={2000}
        rows={2}
        placeholder={t('descriptionPlaceholder')}
        aria-label={t('description')}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => {
          if (description.trim() !== (selection.description ?? '')) {
            save({ description: description.trim() || null });
          }
        }}
      />
      <CheckboxField
        className="max-w-(--container-content-sm) rounded-md border p-3"
        checked={selection.shared}
        onChange={(shared) => save({ shared })}
        label={t('sharedLabel')}
        hint={
          selection.unsharedCount
            ? `${t('sharedHelp')} ${t('unsharedWarning', { count: selection.unsharedCount })}`
            : t('sharedHelp')
        }
      />
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>{t('quizzes')}</SectionTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={items.length >= ITEMS_MAX}
            onClick={() => setAdding(true)}
          >
            <ListPlus className="size-4" />
            {t('addQuiz')}
          </Button>
        </div>
        {items.length === 0 ? (
          <EmptyState icon={ListPlus} title={t('noQuizTitle')}>
            {t('noQuiz')}
          </EmptyState>
        ) : (
          <ol className="flex flex-col gap-2">
            {items.map((item, i) => (
              <ItemRow
                key={item.quizId}
                item={item}
                index={i}
                last={i === items.length - 1}
                onMove={(to) => move(i, to)}
                onChange={(patch) => change(i, patch)}
                onRemove={() => saveItems(items.filter((_, j) => j !== i))}
              />
            ))}
          </ol>
        )}
      </section>
      <AddQuizDialog
        open={adding}
        exclude={items.map((i) => i.quizId)}
        onCancel={() => setAdding(false)}
        onAdd={(quiz) => {
          setAdding(false);
          saveItems([...items, quiz]);
        }}
      />
      <Launches selectionId={selection.id} />
    </section>
  );
}

function ItemRow({
  item,
  index,
  last,
  onMove,
  onChange,
  onRemove,
}: {
  item: Item;
  index: number;
  last: boolean;
  onMove: (to: number) => void;
  onChange: (patch: Partial<Item>) => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation('selections');
  return (
    <li
      className={cn(
        'flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center',
        // One the owner may read but not play: greyed, with why.
        item.unplayable && 'bg-muted/40',
      )}
    >
      <span className="text-muted-foreground w-6 shrink-0 text-sm tabular-nums">{index + 1}.</span>
      <span className={cn('flex min-w-0 flex-1 flex-col gap-0.5', item.unplayable && 'opacity-60')}>
        <Link
          to="/quizzes/$quizId"
          params={{ quizId: item.quizId }}
          className="truncate font-medium hover:underline"
        >
          {item.title}
        </Link>
        <span className="text-muted-foreground flex flex-wrap gap-x-2 text-xs">
          <span>{t('questionCount', { count: item.questionCount })}</span>
          {item.ownerName ? <span>· {t('ownedBy', { name: item.ownerName })}</span> : null}
          {item.unplayable ? <span>· {t(`unplayable.${item.unplayable}`)}</span> : null}
        </span>
      </span>
      <span className="flex flex-wrap items-center gap-2">
        <Select
          className="h-8 w-auto"
          value={item.mode}
          aria-label={t('pace', { title: item.title })}
          onChange={(e) => onChange({ mode: e.target.value as Item['mode'] })}
        >
          <option value="manual">{t('paceManual')}</option>
          <option value="auto">{t('paceAuto')}</option>
        </Select>
        <CheckboxField
          checked={item.autoStart}
          onChange={(autoStart) => onChange({ autoStart })}
          label={t('autoStart')}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={index === 0}
          aria-label={t('moveUp', { title: item.title })}
          onClick={() => onMove(index - 1)}
        >
          <ArrowUp className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={last}
          aria-label={t('moveDown', { title: item.title })}
          onClick={() => onMove(index + 1)}
        >
          <ArrowDown className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={t('remove', { title: item.title })}
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </span>
    </li>
  );
}

/** Adds one of the quizzes the owner may read (theirs, or shared) that is not in the list yet. */
function AddQuizDialog({
  open,
  exclude,
  onCancel,
  onAdd,
}: {
  open: boolean;
  exclude: string[];
  onCancel: () => void;
  onAdd: (item: Item) => void;
}) {
  const { t } = useTranslation(['selections', 'common']);
  const [picked, setPicked] = useState('');
  const quizzes = (useQuizzesControllerList({ query: { enabled: open } }).data?.data ?? []).filter(
    (q) => (q.editable !== false || q.shared) && q.status !== 'archived' && !exclude.includes(q.id),
  );
  const quiz = quizzes.find((q) => q.id === picked);
  return (
    <ConfirmDialog
      open={open}
      wide
      title={t('addQuiz')}
      description={t('addQuizDescription')}
      confirmLabel={t('addThisQuiz')}
      cancelLabel={t('common:cancel')}
      confirmDisabled={!quiz}
      onCancel={() => {
        setPicked('');
        onCancel();
      }}
      onConfirm={() => {
        if (!quiz) return;
        setPicked('');
        onAdd({
          quizId: quiz.id,
          title: quiz.title,
          ...(quiz.editable === false ? { ownerName: quiz.ownerName } : {}),
          status: quiz.status,
          questionCount: quiz.questionCount,
          mode: 'manual',
          autoStart: true,
          unplayable: quiz.status !== 'ready' ? 'draft' : quiz.questionCount > 0 ? null : 'empty',
        });
      }}
    >
      {quizzes.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('noQuizToAdd')}</p>
      ) : (
        <QuizPicker
          quizzes={quizzes}
          value={picked}
          onChange={setPicked}
          playingId={null}
          playedIds={[]}
        />
      )}
    </ConfirmDialog>
  );
}

/** Its launches compared (SPECIFICATIONS-SELECTION): one per room, newest first. */
function Launches({ selectionId }: { selectionId: string }) {
  const { t, i18n } = useTranslation('selections');
  const launches = useSelectionsControllerLaunches(selectionId).data?.data ?? [];
  const date = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(iso),
    );
  const rate = (r: number | null) =>
    r === null ? '—' : new Intl.NumberFormat(i18n.language, { style: 'percent' }).format(r);
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle>{t('launches')}</SectionTitle>
      {launches.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('noLaunch')}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {launches.map((l) => (
            <li key={l.roomId} className="flex flex-col gap-1 rounded-lg border p-3">
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">{l.roomName ?? date(l.startedAt)}</span>
                <span className="text-muted-foreground text-xs">
                  {date(l.startedAt)} · {t('participants', { count: l.participants })}
                </span>
              </span>
              <ul className="text-muted-foreground flex flex-col text-sm">
                {l.sessions.map((s) => (
                  <li key={s.id} className="flex justify-between gap-3">
                    <span className="truncate">{s.quizTitle}</span>
                    <span className="tabular-nums">
                      {t('successRate', { rate: rate(s.successRate) })}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Another host's shared selection: read, launched as it is, or copied into one's own. */
function SelectionReadOnly({ selection }: { selection: SelectionDetailDto }) {
  const { t } = useTranslation('selections');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const duplicate = useSelectionsControllerDuplicate();
  const [error, setError] = useState<string | null>(null);
  return (
    <section className="flex flex-col gap-6">
      <BackLink />
      <header className="flex flex-wrap items-start justify-between gap-3">
        <PageTitle>{selection.name}</PageTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className={twoLineButton}
            disabled={duplicate.isPending}
            onClick={() =>
              duplicate.mutate(
                { id: selection.id },
                {
                  onSuccess: (res) => {
                    void queryClient.invalidateQueries({
                      queryKey: getSelectionsControllerListQueryKey(),
                    });
                    void navigate({
                      to: '/selections/$selectionId',
                      params: { selectionId: res.data.id },
                    });
                  },
                  onError: (err) => setError(apiErrorText(err)),
                },
              )
            }
          >
            <CopyPlus className="size-4 shrink-0" />
            {t('createFrom')}
          </Button>
          <PresentButton selection={selection} />
        </div>
      </header>
      <p role="status" className="bg-muted/40 rounded-lg border px-4 py-3 text-sm">
        {t('readOnlyNotice', { owner: selection.ownerName ?? '' })}
      </p>
      {selection.description ? (
        <p className="text-muted-foreground max-w-(--container-content-sm) text-sm whitespace-pre-line">
          {selection.description}
        </p>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <ol className="flex flex-col gap-2">
        {selection.items.map((item, i) => (
          <li
            key={item.quizId}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3',
              item.unplayable && 'bg-muted/40',
            )}
          >
            <span className="text-muted-foreground w-6 shrink-0 text-sm tabular-nums">
              {i + 1}.
            </span>
            <span className={cn('flex min-w-0 flex-col', item.unplayable && 'opacity-60')}>
              <span className="truncate font-medium">{item.title}</span>
              <span className="text-muted-foreground text-xs">
                {t('questionCount', { count: item.questionCount })}
                {item.unplayable ? ` · ${t(`unplayable.${item.unplayable}`)}` : ''}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
