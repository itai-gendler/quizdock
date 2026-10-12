import {
  DARK_PAGE,
  DEFAULT_LOOK,
  type InterfaceLook,
  LOOK_RADII,
  type LookRadius,
  SHOWCASE_MODES,
  WHITE,
  contrast,
  linkOnDark,
  lookAccessibility,
  parseHex,
} from '@quiz-dock/contracts';
import { Check, RotateCcw } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Disclosure } from '@/components/ui/disclosure';
import { Segmented } from '@/components/ui/segmented';
import { resolveLook } from '@/lib/look';
import { cn } from '@/lib/utils';
import { apiErrorText } from '../../api/http';
import { useThemesControllerUploadAsset } from '../../api/generated/themes/themes';
import { ColorRow, DEFAULT_MODE, PictureLayout, Range } from '../background-style';
import { FontSection } from '../font-section';
import { MediaUpload } from '../media-upload';
import { useReadOperation } from './admin-api';
import { LookPreview } from './look-preview';
import { useOperationAction } from './use-operation-action';
import { APP_NAME } from '../../config';

/** How long a change waits for the next before it is saved. */
const SAVE_DELAY_MS = 600;

/**
 * The administration's Interface space (THEMING lot 2): the instance's look, saved as it
 * changes, beside a preview of the app; its accessibility measured, never declared.
 */
export function AdminInterfacePage() {
  const read = useReadOperation<InterfaceLook>('look.get');
  const saved = read.data?.data;
  return saved ? <LookEditor saved={saved} /> : null;
}

function LookEditor({ saved }: { saved: InterfaceLook }) {
  const { t } = useTranslation('admin');
  const action = useOperationAction();
  const upload = useThemesControllerUploadAsset();
  const [look, setLook] = useState(saved);
  const [state, setState] = useState<'saved' | 'saving' | 'idle'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const change = (next: InterfaceLook) => {
    setLook(next);
    setState('saving');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void action
        .act('look.set', next as unknown as Record<string, unknown>, { refresh: false })
        .then((done) => setState(done ? 'saved' : 'idle'));
    }, SAVE_DELAY_MS);
  };
  const set = <K extends keyof InterfaceLook>(key: K, value: InterfaceLook[K]) =>
    change({ ...look, [key]: value });
  const setShowcase = (part: Partial<InterfaceLook['showcase']>) =>
    set('showcase', { ...look.showcase, ...part });
  const reset = async () => {
    clearTimeout(timer.current);
    if (await action.act('look.reset', {}, { refresh: false })) {
      setLook(DEFAULT_LOOK);
      setState('saved');
    }
  };

  const checks = lookAccessibility(look);
  const met = checks.checks.filter((c) => c.passed).length;
  const primary = parseHex(look.primary);
  const accent = parseHex(look.accent);
  const linkDark = linkOnDark(look.accent);
  const showcase = look.showcase;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground max-w-prose text-sm">{t('look.intro')}</p>
      <div className="flex flex-wrap items-center gap-3">
        {checks.accessible ? <Badge variant="success">{t('look.accessible')}</Badge> : null}
        {action.error ? (
          <p role="alert" className="text-destructive text-sm">
            {action.error}
          </p>
        ) : state !== 'idle' ? (
          <p role="status" className="text-muted-foreground text-sm">
            {state === 'saving' ? (
              t('look.saving')
            ) : (
              <>
                <Check aria-hidden className="text-success-text mr-1 inline size-4" />
                {t('look.saved')}
              </>
            )}
          </p>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={action.busy}
          onClick={() => void reset()}
        >
          <RotateCcw aria-hidden className="size-4" />
          {t('look.reset')}
        </Button>
      </div>
      <div className="grid items-start gap-x-8 gap-y-4 lg:grid-cols-[26rem_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-2">
          <Disclosure
            title={t('look.colours')}
            rememberAs="look-colours"
            value={`${look.primary} · ${look.accent}`}
          >
            <ColorRow
              label={t('look.primary')}
              value={look.primary}
              onChange={(v) => set('primary', v)}
            />
            <div className="flex flex-wrap gap-2">
              {[false, true].map((dark) => (
                <Sample key={String(dark)} dark={dark}>
                  <span
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-white"
                    style={{ background: look.primary }}
                  >
                    {t('look.button')}
                  </span>
                </Sample>
              ))}
            </div>
            <p className="flex flex-wrap gap-x-3 text-xs">
              <span>
                {t('look.whiteText')} <Ratio value={contrast(WHITE, primary)} min={4.5} />
              </span>
              <span>
                {t('look.onLight')} <Ratio value={contrast(primary, WHITE)} min={3} />
              </span>
              <span>
                {t('look.onDark')} <Ratio value={contrast(primary, DARK_PAGE)} min={3} />
              </span>
            </p>
            <p className="text-muted-foreground text-xs">{t('look.primaryHint')}</p>
            <ColorRow
              label={t('look.accent')}
              value={look.accent}
              onChange={(v) => set('accent', v)}
            />
            <div className="flex flex-wrap gap-2">
              <Sample dark={false}>
                <span className="text-sm underline" style={{ color: look.accent }}>
                  {t('look.link')}
                </span>
                <Ratio value={contrast(accent, WHITE)} min={4.5} />
              </Sample>
              <Sample dark>
                <span className="text-sm underline" style={{ color: linkDark }}>
                  {t('look.link')}
                </span>
                <Ratio value={contrast(parseHex(linkDark), DARK_PAGE)} min={7} dark />
              </Sample>
            </div>
            <p className="text-muted-foreground text-xs">{t('look.accentHint')}</p>
          </Disclosure>

          <FontSection
            font={look.font}
            rememberAs="look-font"
            onChange={(font) => set('font', font as InterfaceLook['font'])}
            onUpload={(file, license) =>
              upload.mutate(
                { kind: 'font', data: { file } },
                { onSuccess: (res) => set('font', { file: res.data.mediaId, license }) },
              )
            }
          />
          {upload.error ? (
            <p role="alert" className="text-destructive text-sm">
              {apiErrorText(upload.error)}
            </p>
          ) : null}

          <Disclosure
            title={t('look.corners')}
            rememberAs="look-corners"
            value={t(`look.radius.${look.radius}`)}
          >
            <Segmented
              className="w-fit"
              label={t('look.corners')}
              value={look.radius}
              onChange={(r: LookRadius) => set('radius', r)}
              options={(Object.keys(LOOK_RADII) as LookRadius[]).map((r) => ({
                value: r,
                label: t(`look.radius.${r}`),
              }))}
            />
            <div className="flex gap-2">
              {(['card', 'button', 'field'] as const).map((k) => (
                <span
                  key={k}
                  className="grid h-10 flex-1 place-items-center border text-xs"
                  style={{ borderRadius: `${LOOK_RADII[look.radius]}rem` }}
                >
                  {t(`look.cornerSample.${k}`)}
                </span>
              ))}
            </div>
          </Disclosure>

          <Disclosure
            title={t('look.showcase')}
            rememberAs="look-showcase"
            value={t(`look.mode.${showcase.mode}`)}
          >
            <p className="text-muted-foreground text-xs">{t('look.showcaseHint')}</p>
            <Segmented
              className="w-fit flex-wrap"
              label={t('look.showcase')}
              value={showcase.mode}
              onChange={(mode) => setShowcase({ mode })}
              options={SHOWCASE_MODES.map((m) => ({ value: m, label: t(`look.mode.${m}`) }))}
            />
            {showcase.mode === 'logo' ? (
              <>
                <p className="text-muted-foreground text-xs">{t('look.logoHint')}</p>
                <Range
                  label={t('look.size')}
                  min={15}
                  max={90}
                  step={1}
                  value={showcase.size}
                  format={(v) => `${v} %`}
                  onChange={(size) => setShowcase({ size })}
                />
                <Range
                  label={t('look.opacity')}
                  min={0.02}
                  max={0.3}
                  step={0.01}
                  value={showcase.opacity}
                  format={(v) => `${Math.round(v * 100)} %`}
                  onChange={(opacity) => setShowcase({ opacity })}
                />
              </>
            ) : null}
            {showcase.mode === 'picture' ? (
              <>
                <MediaUpload
                  value={showcase.picture?.image ?? null}
                  withDetails={false}
                  onChange={(id) =>
                    setShowcase({
                      picture: id
                        ? { image: id, style: showcase.picture?.style ?? { mode: DEFAULT_MODE } }
                        : null,
                    })
                  }
                />
                {showcase.picture ? (
                  <PictureLayout
                    style={showcase.picture.style}
                    textTone="dark"
                    onChange={(style) =>
                      showcase.picture && setShowcase({ picture: { ...showcase.picture, style } })
                    }
                  />
                ) : null}
              </>
            ) : null}
          </Disclosure>

          <Disclosure
            title={t('look.accessibility')}
            rememberAs="look-accessibility"
            value={
              checks.accessible
                ? t('look.accessible')
                : t('look.checksMet', { met, total: checks.checks.length })
            }
          >
            <p className="text-muted-foreground text-xs">{t('look.accessibilityHint')}</p>
            <ul className="flex flex-col gap-2">
              {checks.checks.map((c) => (
                <li
                  key={c.code}
                  className={cn(
                    'flex items-start gap-2 text-sm',
                    !c.passed && 'text-muted-foreground',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full',
                      c.passed ? 'bg-success-text text-white' : 'border',
                    )}
                  >
                    {c.passed ? <Check className="size-3" /> : null}
                  </span>
                  <span>
                    <span className="sr-only">{c.passed ? '✓ ' : '✗ '}</span>
                    {t(`look.check.${c.code}`)}
                  </span>
                </li>
              ))}
            </ul>
          </Disclosure>
        </div>
        <LookPreview look={resolveLook(look)} name={APP_NAME} />
      </div>
    </div>
  );
}

/** A sample on the light or the dark page. */
function Sample({ dark, children }: { dark: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        'flex flex-1 items-center justify-between gap-2 rounded-md border p-2',
        dark ? 'bg-[#0e0e0e]' : 'bg-white',
      )}
    >
      {children}
    </span>
  );
}

/** A contrast ratio, readable where it sits; below its minimum, said so. */
function Ratio({ value, min, dark = false }: { value: number; min: number; dark?: boolean }) {
  const ok = value >= min;
  return (
    <span
      className={cn(
        'text-xs tabular-nums',
        ok
          ? dark
            ? 'text-[oklch(0.85_0_0)]'
            : 'text-muted-foreground'
          : cn('font-semibold', dark ? 'text-[oklch(0.8_0.15_27)]' : 'text-destructive'),
      )}
    >
      {value.toFixed(1)}:1
    </span>
  );
}
