import {
  ICON_BANK,
  ICON_SETS,
  type IconGroup,
  OPTION_ORDER,
  type ThemeSlotName,
  bankIconUrl,
} from '@quiz-dock/contracts';
import { Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { SectionTitle } from '@/components/ui/page-title';
import { fold } from '@/lib/text';
import { cn } from '@/lib/utils';

const GROUPS = Object.keys(ICON_BANK) as IconGroup[];

/** An icon of the bank, drawn in the text colour through its mask. */
export function BankIcon({ refName, className }: { refName: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-block size-[1em] bg-current', className)}
      style={{
        maskImage: `url("${bankIconUrl(refName)}")`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  );
}

/**
 * The icon bank (docs/themes.md): one icon for one answer — searched by name, by group —
 * or an SVG of one's own; or, for all eight answers at once, a set of eight.
 */
export function IconPicker({
  slot,
  colors,
  textColor = '#ffffff',
  current,
  uploading,
  onPick,
  onPickSet,
  onUpload,
  onReset,
  onClose,
}: {
  /** The answer to give an icon; null: a set for the eight. */
  slot: ThemeSlotName | null;
  colors: Record<ThemeSlotName, string>;
  textColor?: string;
  current?: string | null;
  uploading?: boolean;
  onPick: (ref: string) => void;
  onPickSet: (refs: string[]) => void;
  onUpload: (file: File) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation('themes');
  const [group, setGroup] = useState<IconGroup | 'all'>('all');
  const [q, setQ] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const close = (
    <Button variant="ghost" size="sm" onClick={onClose} aria-label={t('close')}>
      <X className="size-4" />
    </Button>
  );

  if (!slot) {
    return (
      <Modal onClose={onClose} className="max-w-3xl" aria-label={t('icons.setTitle')}>
        <div className="flex max-h-[85dvh] flex-col gap-4 overflow-auto p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('icons.setTitle')}</h2>
            {close}
          </div>
          <p className="text-muted-foreground text-sm">{t('icons.setHint')}</p>
          <ul className="flex flex-col gap-2">
            {GROUPS.map((g) => (
              <li key={g}>
                <button
                  type="button"
                  onClick={() => onPickSet(ICON_SETS[g].map((n) => `bank:${g}/${n}`))}
                  className="hover:bg-accent flex w-full flex-wrap items-center gap-3 rounded-md border p-2 text-left text-sm"
                >
                  <span className="w-36 font-medium">{t(`icons.group.${g}`)}</span>
                  <span className="flex flex-wrap gap-1">
                    {ICON_SETS[g].map((n, i) => (
                      <span
                        key={n}
                        className="grid size-9 place-items-center rounded-md text-lg"
                        style={{ background: colors[OPTION_ORDER[i].color], color: textColor }}
                      >
                        <BankIcon refName={`bank:${g}/${n}`} />
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    );
  }

  const found = (g: IconGroup) =>
    (ICON_BANK[g] as readonly string[]).filter((n) => fold(n.replace(/-/g, ' ')).includes(fold(q)));
  const shown = (group === 'all' ? GROUPS : [group]).filter((g) => found(g).length);
  return (
    <Modal onClose={onClose} className="max-w-3xl" aria-label={t('icons.title')}>
      <div className="flex max-h-[85dvh] flex-col gap-4 overflow-auto p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{t('icons.title')}</h2>
          {close}
        </div>
        <div
          role="group"
          aria-label={t('icons.groups')}
          className="bg-muted flex w-fit flex-wrap gap-1 rounded-md p-1 text-sm"
        >
          {(['all', ...GROUPS] as const).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={cn(
                'rounded px-2.5 py-1',
                group === g
                  ? 'bg-background font-medium shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {g === 'all' ? t('icons.all') : t(`icons.group.${g}`)}
            </button>
          ))}
        </div>
        <label className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('icons.search')}
            aria-label={t('icons.search')}
            className="pl-8"
          />
        </label>
        {shown.length ? (
          shown.map((g) => (
            <div key={g} className="flex flex-col gap-2">
              <SectionTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {t(`icons.group.${g}`)}
              </SectionTitle>
              <ul className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                {found(g).map((n) => {
                  const ref = `bank:${g}/${n}`;
                  return (
                    <li key={n}>
                      <button
                        type="button"
                        title={n.replace(/-/g, ' ')}
                        aria-label={n.replace(/-/g, ' ')}
                        aria-pressed={current === ref}
                        onClick={() => onPick(ref)}
                        className={cn(
                          'grid aspect-square w-full place-items-center rounded-md text-2xl',
                          current === ref
                            ? 'ring-primary ring-2 ring-offset-2'
                            : 'hover:ring-primary/60 hover:ring-2',
                        )}
                        style={{ background: colors[slot], color: textColor }}
                      >
                        <BankIcon refName={ref} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">{t('icons.noMatch')}</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-sm">
          <input
            ref={fileRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = '';
            }}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {t('icons.upload')}
          </Button>
          <span className="text-muted-foreground max-w-md text-xs">{t('icons.uploadHint')}</span>
          <Button variant="ghost" size="sm" onClick={onReset}>
            {t('icons.reset')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
