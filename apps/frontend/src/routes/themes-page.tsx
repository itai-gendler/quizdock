import { BUILTIN_THEMES, type BuiltinTheme, THEME_NAME_MAX } from '@quiz-dock/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Accessibility, MoreHorizontal, Search, Star } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { MenuItem } from '@/components/ui/menu-item';
import { PageTitle, SectionTitle } from '@/components/ui/page-title';
import { Popover } from '@/components/ui/popover';
import { fold } from '@/lib/text';
import { builtinValues, isAccessible, themeValuesOf } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { useRole } from '../auth/use-role';
import { downloadFile } from '../api/download';
import { apiErrorText } from '../api/http';
import type { ThemeDto } from '../api/generated/model';
import {
  getThemesControllerListQueryKey,
  useThemesControllerCreate,
  useThemesControllerDuplicate,
  useThemesControllerImportTheme,
  useThemesControllerList,
  useThemesControllerRemove,
  useThemesControllerSetDefault,
} from '../api/generated/themes/themes';
import { ThemeThumbnail } from '../game/theme-preview';
import { Modal } from '@/components/ui/modal';

/**
 * The library of quiz themes (docs/themes.md): the shipped ones, then the hosts'. Every
 * host uses every theme; its owner and the administrators change it.
 */
export function ThemesPage() {
  const { t } = useTranslation('themes');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isManager } = useRole();
  const { data } = useThemesControllerList();
  const list = data?.data;
  const [q, setQ] = useState('');
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [newFrom, setNewFrom] = useState<BuiltinTheme | null>(null);
  const [toDelete, setToDelete] = useState<ThemeDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: getThemesControllerListQueryKey() });
  const fail = (err: unknown) => setError(apiErrorText(err));
  const create = useThemesControllerCreate();
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
  const mine = (list?.themes ?? []).filter((th) => matches(th.name, isAccessible(th)));

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <header className="flex flex-col gap-1">
          <PageTitle>{t('title')}</PageTitle>
          <p className="text-muted-foreground max-w-prose text-sm">{t('intro')}</p>
        </header>
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
          <Button
            variant="outline"
            disabled={importTheme.isPending}
            onClick={() => fileRef.current?.click()}
          >
            {t('import')}
          </Button>
          <Button onClick={() => setNewFrom('classic')}>{t('new')}</Button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative w-full max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search')}
            aria-label={t('search')}
            className="pl-8"
          />
        </label>
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

      <SectionTitle>{t('shipped', { n: shipped.length })}</SectionTitle>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shipped.map(({ key, values }) => (
          <ThemeCard
            key={key}
            name={t(`builtin.${key}`)}
            meta={t('shippedMeta')}
            values={values}
            accessible={isAccessible(values)}
            isDefault={defaultRef.builtin === key}
            onOpen={() => setNewFrom(key)}
            primary={{ label: t('newFrom'), onClick: () => setNewFrom(key) }}
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
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                onOpen={() => openEditor(th.id)}
                primary={
                  th.canEdit ? { label: t('edit'), onClick: () => openEditor(th.id) } : undefined
                }
                secondary={{ label: t('duplicate'), onClick: () => onDuplicate(th) }}
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

      {newFrom ? (
        <NewThemeDialog
          parent={newFrom}
          busy={create.isPending}
          onCancel={() => setNewFrom(null)}
          onCreate={(name, parent) =>
            create.mutate(
              { data: { name, parent, overrides: {} } },
              {
                onSuccess: (res) => {
                  setNewFrom(null);
                  void refresh();
                  openEditor(res.data.id);
                },
                onError: fail,
              },
            )
          }
        />
      ) : null}

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
  onOpen,
  primary,
  secondary,
  menu,
}: {
  name: string;
  meta: string;
  values: Parameters<typeof ThemeThumbnail>[0]['theme'];
  accessible: boolean;
  isDefault: boolean;
  usedIn?: number;
  onOpen: () => void;
  primary?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  menu: MenuEntry[];
}) {
  const { t } = useTranslation('themes');
  return (
    <li className="hover:bg-accent/40 relative flex flex-col overflow-hidden rounded-lg border transition-colors">
      <button type="button" onClick={onOpen} aria-label={name} className="block text-left">
        <ThemeThumbnail theme={values} />
      </button>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold">{name}</span>
          {accessible ? <AccessibleBadge /> : null}
        </div>
        <p className="text-muted-foreground text-xs">{meta}</p>
        <p className="text-muted-foreground flex flex-wrap gap-x-3 text-xs">
          {isDefault ? (
            <span className="text-foreground inline-flex items-center gap-1 font-medium">
              <Star className="size-3.5" />
              {t('isDefault')}
            </span>
          ) : null}
          {usedIn !== undefined ? (
            <span>{usedIn ? t('usedIn', { count: usedIn }) : t('unused')}</span>
          ) : null}
        </p>
      </div>
      <div className="flex items-center justify-end gap-2 border-t p-3">
        {primary ? (
          <Button variant="outline" size="sm" onClick={primary.onClick}>
            {primary.label}
          </Button>
        ) : null}
        {secondary ? (
          <Button variant="ghost" size="sm" onClick={secondary.onClick}>
            {secondary.label}
          </Button>
        ) : null}
        {menu.length ? (
          <Popover
            align="end"
            trigger={({ toggle }) => (
              <Button variant="ghost" size="sm" onClick={toggle} aria-label={t('more', { name })}>
                <MoreHorizontal className="size-4" />
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
        ) : null}
      </div>
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

function NewThemeDialog({
  parent,
  busy,
  onCancel,
  onCreate,
}: {
  parent: BuiltinTheme;
  busy: boolean;
  onCancel: () => void;
  onCreate: (name: string, parent: BuiltinTheme) => void;
}) {
  const { t } = useTranslation('themes');
  const [from, setFrom] = useState<BuiltinTheme>(parent);
  const [name, setName] = useState(t('newName', { parent: t(`builtin.${parent}`) }));
  return (
    <Modal onClose={onCancel} className="max-w-3xl" aria-label={t('new')}>
      <form
        className="flex max-h-[85dvh] flex-col gap-4 overflow-auto p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onCreate(name.trim(), from);
        }}
      >
        <h2 className="text-lg font-semibold">{t('new')}</h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t('name')}</span>
          <Input
            value={name}
            maxLength={THEME_NAME_MAX}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t('startsFrom')}</span>
          <p className="text-muted-foreground text-xs">{t('startsFromHint')}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BUILTIN_THEMES.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={from === key}
                onClick={() => setFrom(key)}
                className={cn(
                  'overflow-hidden rounded-md border text-left text-xs',
                  from === key ? 'ring-primary ring-2' : 'hover:ring-primary/50 hover:ring-1',
                )}
              >
                <ThemeThumbnail theme={builtinValues(key)} />
                <span className="block px-2 py-1">{t(`builtin.${key}`)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={busy || !name.trim()}>
            {t('create')}
          </Button>
        </div>
      </form>
    </Modal>
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
