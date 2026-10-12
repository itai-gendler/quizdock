import {
  BUILTIN_THEME_VALUES,
  type BuiltinTheme,
  FONT_LICENSES,
  MOTION_STYLES,
  OPTION_ORDER,
  SHIPPED_PICTURES,
  SLOT_MARKERS,
  THEME_FONTS,
  THEME_NAME_MAX,
  THEME_SOUNDS,
  type ThemeBackground,
  type ThemeOverrides,
  type ThemeSlotName,
  contrast,
  mergeTheme,
  parseHex,
  themeAccessibility,
} from '@quiz-dock/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { Check, ChevronLeft, Download, Shapes } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Disclosure } from '@/components/ui/disclosure';
import { Input } from '@/components/ui/input';
import { Notice } from '@/components/ui/notice';
import { Segmented } from '@/components/ui/segmented';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { themeValuesOf } from '@/lib/themes';
import { downloadFile } from '../api/download';
import { apiErrorText } from '../api/http';
import type { ThemeDto } from '../api/generated/model';
import {
  getThemesControllerGetQueryKey,
  getThemesControllerListQueryKey,
  useThemesControllerDuplicate,
  useThemesControllerGet,
  useThemesControllerUpdate,
  useThemesControllerUploadAsset,
} from '../api/generated/themes/themes';
import { PREVIEW_PHASES, type PreviewPhase, ThemePreview } from '../game/theme-preview';
import { ShapeIcon } from '@/components/shape-icon';
import { LiveTheme } from '../game/theme';
import { gradientCss } from '../game/surface';
import { ColorRow, PictureLayout, Range } from './background-style';
import { IconPicker } from './icon-picker';
import { MediaUpload } from './media-upload';
import { AccessibleBadge } from './themes-page';

const SAVE_DELAY_MS = 600;

/**
 * A theme of the library, changed with its live preview (docs/themes.md): each part
 * follows the shipped theme it starts from until it is changed, and can go back to it.
 * Saved as it is changed; a quiz using it shows it from its next game.
 */
export function ThemeEditorPage() {
  const { themeId } = useParams({ from: '/themes/$themeId' });
  const { t } = useTranslation('themes');
  const { data, error } = useThemesControllerGet(themeId);
  const theme = data?.data;
  if (error) return <p className="text-destructive">{apiErrorText(error)}</p>;
  if (!theme) return <p className="text-muted-foreground">{t('loading')}</p>;
  return <Editor key={theme.id} theme={theme} />;
}

function Editor({ theme }: { theme: ThemeDto }) {
  const { t } = useTranslation('themes');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState(theme.name);
  const [overrides, setOverrides] = useState<ThemeOverrides>(theme.overrides as ThemeOverrides);
  const [state, setState] = useState<'saved' | 'saving' | 'error'>('saved');
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<PreviewPhase>('question');
  const [device, setDevice] = useState<'both' | 'projection' | 'phone'>('both');
  const [iconFor, setIconFor] = useState<ThemeSlotName | 'all' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const update = useThemesControllerUpdate();
  const duplicate = useThemesControllerDuplicate();
  const upload = useThemesControllerUploadAsset();
  const editable = theme.canEdit;
  const parent = theme.parent as BuiltinTheme;
  const parentValues = BUILTIN_THEME_VALUES[parent];

  // Saved a moment after the last change, as the quiz editor does.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!editable || !name.trim()) return;
    setState('saving');
    const timer = setTimeout(() => {
      update.mutate(
        { id: theme.id, data: { name: name.trim(), overrides } },
        {
          onSuccess: (res) => {
            setState('saved');
            setError(null);
            queryClient.setQueryData(getThemesControllerGetQueryKey(theme.id), res);
            void queryClient.invalidateQueries({ queryKey: getThemesControllerListQueryKey() });
          },
          onError: (err) => {
            setState('error');
            setError(apiErrorText(err));
          },
        },
      );
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, overrides]);

  const values = useMemo(
    () => themeValuesOf({ parent: theme.parent, overrides, media: theme.media }),
    [theme.parent, theme.media, overrides],
  );
  const merged = useMemo(() => mergeTheme(parentValues, overrides), [parentValues, overrides]);
  const accessibility = useMemo(() => themeAccessibility(merged), [merged]);

  const set = <K extends keyof ThemeOverrides>(key: K, value: ThemeOverrides[K]) =>
    setOverrides((o) => ({ ...o, [key]: value }));
  const reset = (key: keyof ThemeOverrides) =>
    setOverrides((o) => {
      const rest = { ...o };
      delete rest[key];
      return rest;
    });
  const changed = (key: keyof ThemeOverrides) =>
    key === 'slots' ? Object.keys(overrides.slots ?? {}).length > 0 : overrides[key] !== undefined;
  const origin = (key: keyof ThemeOverrides) =>
    editable && changed(key) ? (
      <button
        type="button"
        onClick={() => reset(key)}
        className="text-primary w-fit text-xs hover:underline"
      >
        {t('editor.reset', { parent: t(`builtin.${parent}`) })}
      </button>
    ) : (
      <span className="text-muted-foreground text-xs">
        {changed(key)
          ? t('editor.changed')
          : t('editor.inherited', { parent: t(`builtin.${parent}`) })}
      </span>
    );

  const bg = merged.background;
  const setBg = (next: ThemeBackground) => set('background', next);
  const setSlot = (slot: ThemeSlotName, patch: Partial<{ color: string; icon: string | null }>) =>
    set('slots', { ...overrides.slots, [slot]: { ...merged.slots[slot], ...patch } });

  const uploadIcon = (slot: ThemeSlotName, file: File) =>
    upload.mutate(
      { kind: 'icon', data: { file } },
      {
        onSuccess: (res) => {
          setSlot(slot, { icon: res.data.mediaId });
          setIconFor(null);
          setNotice(res.data.strokeRemoved ? t('icons.strokeRemoved') : null);
        },
        onError: (err) => setNotice(apiErrorText(err)),
      },
    );

  const bgKind = bg.image ? 'picture' : bg.gradient ? 'gradient' : 'colour';
  const textWhite = '#ffffff';

  return (
    <section className="flex flex-col gap-4">
      <Link
        to="/themes"
        className="text-muted-foreground inline-flex w-fit items-center gap-1 text-sm hover:underline"
      >
        <ChevronLeft className="size-4" />
        {t('title')}
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={name}
          maxLength={THEME_NAME_MAX}
          disabled={!editable}
          onChange={(e) => setName(e.target.value)}
          aria-label={t('name')}
          className="hover:bg-accent/60 -mx-2 h-auto min-w-0 flex-1 border-0 bg-transparent px-2 text-3xl font-bold tracking-tight shadow-none"
        />
        {accessibility.status === 'compliant' ? <AccessibleBadge /> : null}
        {editable ? (
          <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
            {state === 'saving' ? (
              t('editor.saving')
            ) : state === 'saved' ? (
              <>
                <Check className="text-success size-4" />
                {t('editor.saved')}
              </>
            ) : null}
          </span>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            void downloadFile(
              `/api/v1/themes/${theme.id}/export`,
              'theme.quizdock-theme.zip',
            ).catch((e) => setError(apiErrorText(e)))
          }
        >
          <Download className="size-4" />
          {t('export')}
        </Button>
      </div>
      <p className="text-muted-foreground -mt-2 text-sm">
        {t('editor.from', { parent: t(`builtin.${parent}`), count: theme.quizCount })}
      </p>
      {!editable ? (
        <Notice>
          <span className="flex flex-wrap items-center gap-3">
            {t('editor.readOnly', { owner: theme.owner.name })}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                duplicate.mutate(
                  {
                    id: theme.id,
                    data: { name: t('copyName', { name: theme.name }).slice(0, THEME_NAME_MAX) },
                  },
                  {
                    onSuccess: (res) =>
                      void navigate({ to: '/themes/$themeId', params: { themeId: res.data.id } }),
                  },
                )
              }
            >
              {t('duplicate')}
            </Button>
          </span>
        </Notice>
      ) : null}
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
      {notice ? <Notice>{notice}</Notice> : null}

      <div className="grid items-start gap-x-8 gap-y-4 lg:grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[24rem_minmax(0,1fr)]">
        <fieldset disabled={!editable} className="flex min-w-0 flex-col gap-2">
          <Disclosure
            title={t('editor.background')}
            rememberAs="theme-background"
            value={`${t(`editor.bgKind.${bgKind}`)} · ${t(`editor.tone.${bg.textTone}`)}`}
          >
            {origin('background')}
            <Segmented
              className="w-fit"
              label={t('editor.background')}
              value={bgKind}
              onChange={(k) => {
                const rest = { color: bg.color, textTone: bg.textTone };
                setBg(
                  k === 'picture'
                    ? { ...rest, image: `shipped:${SHIPPED_PICTURES[0]}`, mode: 'cover' }
                    : k === 'gradient'
                      ? { ...rest, gradient: { angle: 135, colors: [bg.color, '#5b1a6e'] } }
                      : rest,
                );
              }}
              options={(['colour', 'gradient', 'picture'] as const).map((k) => ({
                value: k,
                label: t(`editor.bgKind.${k}`),
              }))}
            />
            <ColorRow
              label={t('editor.baseColour')}
              value={bg.color}
              onChange={(color) => setBg({ ...bg, color })}
            />
            {bg.gradient ? (
              <>
                <div
                  className="h-12 w-full rounded-md border"
                  style={{ backgroundImage: gradientCss(bg.gradient) }}
                />
                <div className="flex flex-wrap gap-2">
                  {bg.gradient.colors.map((c, i) => (
                    <input
                      key={i}
                      type="color"
                      value={c}
                      aria-label={t('editor.gradientColour', { index: i + 1 })}
                      className="size-9 cursor-pointer rounded-md border p-0.5"
                      onChange={(e) =>
                        setBg({
                          ...bg,
                          gradient: {
                            ...bg.gradient!,
                            colors: bg.gradient!.colors.map((x, j) =>
                              j === i ? e.target.value : x,
                            ),
                          },
                        })
                      }
                    />
                  ))}
                </div>
                <Range
                  label={t('editor.angle')}
                  min={0}
                  max={360}
                  step={5}
                  value={bg.gradient.angle}
                  format={(v) => `${v}°`}
                  onChange={(angle) => setBg({ ...bg, gradient: { ...bg.gradient!, angle } })}
                />
              </>
            ) : null}
            {bg.image ? (
              <>
                <label className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{t('editor.picture')}</span>
                  <Select
                    className="h-8 w-auto"
                    value={bg.image.startsWith('shipped:') ? bg.image : 'own'}
                    onChange={(e) =>
                      e.target.value !== 'own' && setBg({ ...bg, image: e.target.value })
                    }
                  >
                    {SHIPPED_PICTURES.map((p) => (
                      <option key={p} value={`shipped:${p}`}>
                        {t(`editor.shippedPicture.${p.replace('.svg', '')}`)}
                      </option>
                    ))}
                    <option value="own">{t('editor.ownPicture')}</option>
                  </Select>
                </label>
                <MediaUpload
                  value={bg.image.startsWith('shipped:') ? null : bg.image}
                  withDetails={false}
                  onChange={(id) => id && setBg({ ...bg, image: id })}
                />
                <PictureLayout
                  style={bg}
                  textTone={bg.textTone}
                  onChange={(style) => setBg({ ...bg, ...style })}
                />
              </>
            ) : null}
            <label className="flex items-center gap-2 border-t pt-3 text-sm">
              <span className="font-medium">{t('editor.textContrast')}</span>
              <Select
                className="h-8 w-auto"
                value={bg.textTone}
                onChange={(e) => setBg({ ...bg, textTone: e.target.value as 'light' | 'dark' })}
              >
                <option value="light">{t('editor.tone.light')}</option>
                <option value="dark">{t('editor.tone.dark')}</option>
              </Select>
            </label>
          </Disclosure>

          <Disclosure
            title={t('editor.answers')}
            rememberAs="theme-answers"
            value={t(`editor.markers.${merged.markers}`)}
          >
            {origin('slots')}
            <span className="text-sm font-medium">{t('editor.markedBy')}</span>
            <Segmented
              className="w-fit"
              label={t('editor.markedBy')}
              value={merged.markers}
              onChange={(m) => set('markers', m)}
              options={SLOT_MARKERS.map((m) => ({ value: m, label: t(`editor.markers.${m}`) }))}
            />
            <p className="text-muted-foreground text-xs">{t('editor.markersHint')}</p>
            {merged.markers === 'icons' ? (
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => setIconFor('all')}
              >
                {t('icons.setButton')}
              </Button>
            ) : null}
            <p className="text-muted-foreground text-xs">{t('editor.textHint')}</p>
            <LiveTheme theme={values}>
              <ul className="flex flex-col gap-1.5">
                {OPTION_ORDER.map(({ color: slot, shape }, i) => {
                  const c = merged.slots[slot].color;
                  const ratio = contrast([1, 1, 1], parseHex(c));
                  return (
                    <li key={slot} className="flex items-center gap-2 text-sm">
                      <input
                        type="color"
                        value={c}
                        aria-label={t('editor.slotColour', { slot: t(`slot.${slot}`) })}
                        className="size-9 cursor-pointer rounded-md border p-0.5"
                        onChange={(e) => setSlot(slot, { color: e.target.value })}
                      />
                      <span
                        className="grid size-9 place-items-center rounded-md text-lg"
                        style={{ background: c, color: textWhite }}
                      >
                        <ShapeIcon shape={shape} slot={slot} index={i} />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{t(`slot.${slot}`)}</span>
                      <span
                        className={
                          ratio >= 4.5
                            ? 'text-muted-foreground text-xs tabular-nums'
                            : 'text-xs font-medium tabular-nums'
                        }
                        title={t('editor.ratioHint')}
                      >
                        {ratio.toFixed(1)}:1
                      </span>
                      {merged.markers === 'icons' ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          aria-label={t('icons.buttonFor', { slot: t(`slot.${slot}`) })}
                          title={t('icons.buttonFor', { slot: t(`slot.${slot}`) })}
                          onClick={() => setIconFor(slot)}
                        >
                          <Shapes className="size-4" />
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </LiveTheme>
          </Disclosure>

          <Disclosure title={t('editor.accent')} rememberAs="theme-accent" value={merged.accent}>
            {origin('accent')}
            <ColorRow
              label={t('editor.accent')}
              value={merged.accent}
              onChange={(v) => set('accent', v)}
            />
            <p className="text-muted-foreground text-xs">{t('editor.accentHint')}</p>
          </Disclosure>

          <FontSection
            font={merged.font}
            origin={origin('font')}
            onChange={(f) => set('font', f)}
            onUpload={(file, license) =>
              upload.mutate(
                { kind: 'font', data: { file } },
                {
                  onSuccess: (res) => set('font', { file: res.data.mediaId, license }),
                  onError: (err) => setNotice(apiErrorText(err)),
                },
              )
            }
          />

          <Disclosure
            title={t('editor.sounds')}
            rememberAs="theme-sounds"
            value={
              Object.keys(merged.sounds).length
                ? t('editor.ownSounds', { count: Object.keys(merged.sounds).length })
                : t('editor.builtinSounds')
            }
          >
            {origin('sounds')}
            <ul className="flex flex-col gap-3">
              {THEME_SOUNDS.map((k) => (
                <li key={k} className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">{t(`editor.sound.${k}`)}</span>
                  <MediaUpload
                    kind="audio"
                    withDetails={false}
                    value={merged.sounds[k] ?? null}
                    label={t('editor.soundUpload')}
                    onChange={(id) => {
                      const rest = { ...merged.sounds };
                      delete rest[k];
                      set('sounds', id ? { ...rest, [k]: id } : rest);
                    }}
                  />
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-xs">{t('editor.soundsHint')}</p>
          </Disclosure>

          <Disclosure
            title={t('editor.motion')}
            rememberAs="theme-motion"
            value={`${t(`editor.motionStyle.${merged.motion.style}`)}${merged.motion.revealEffect ? ` · ${t('editor.confetti')}` : ''}`}
          >
            {origin('motion')}
            <Segmented
              className="w-fit flex-wrap"
              label={t('editor.motion')}
              value={merged.motion.style}
              onChange={(style) => set('motion', { ...merged.motion, style })}
              options={MOTION_STYLES.map((s) => ({
                value: s,
                label: t(`editor.motionStyle.${s}`),
              }))}
            />
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={merged.motion.revealEffect === 'confetti'}
                onCheckedChange={(on) =>
                  set('motion', { ...merged.motion, revealEffect: on ? 'confetti' : null })
                }
                aria-label={t('editor.confettiLabel')}
              />
              {t('editor.confettiLabel')}
            </label>
            <p className="text-muted-foreground text-xs">{t('editor.motionHint')}</p>
          </Disclosure>

          <Disclosure
            title={t('editor.accessibility')}
            rememberAs="theme-accessibility"
            value={
              accessibility.status === 'compliant'
                ? t('accessible')
                : t('editor.checksMet', {
                    met: accessibility.checks.filter((c) => c.passed).length,
                    total: accessibility.checks.length,
                  })
            }
          >
            <p className="text-muted-foreground text-xs">{t('editor.accessibilityHint')}</p>
            <ul className="flex flex-col gap-2">
              {accessibility.checks.map((c) => (
                <li
                  key={c.code}
                  className={
                    c.passed
                      ? 'flex items-start gap-2 text-sm'
                      : 'text-muted-foreground flex items-start gap-2 text-sm'
                  }
                >
                  <span
                    aria-hidden
                    className={
                      c.passed
                        ? 'bg-success mt-0.5 grid size-4 shrink-0 place-items-center rounded-full text-[0.6rem] text-white'
                        : 'mt-0.5 size-4 shrink-0 rounded-full border'
                    }
                  >
                    {c.passed ? '✓' : null}
                  </span>
                  <span>
                    {t(`check.${c.code}`)}
                    {!c.passed && c.slots?.length ? (
                      <span className="block text-xs">
                        {c.slots.map((s) => t(`slot.${s}`)).join(', ')}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </Disclosure>
        </fieldset>

        <div className="bg-muted/40 flex min-w-0 flex-col gap-4 rounded-2xl p-4 lg:sticky lg:top-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              label={t('preview.phase')}
              value={phase}
              onChange={setPhase}
              options={PREVIEW_PHASES.map((p) => ({ value: p, label: t(`preview.phases.${p}`) }))}
            />
            <Segmented
              size="sm"
              label={t('preview.device')}
              value={device}
              onChange={setDevice}
              options={(['both', 'projection', 'phone'] as const).map((d) => ({
                value: d,
                label: t(`preview.devices.${d}`),
              }))}
            />
          </div>
          <ThemePreview theme={values} phase={phase} device={device} />
        </div>
      </div>

      {iconFor ? (
        <IconPicker
          slot={iconFor === 'all' ? null : iconFor}
          colors={
            Object.fromEntries(
              OPTION_ORDER.map((p) => [p.color, merged.slots[p.color].color]),
            ) as Record<ThemeSlotName, string>
          }
          current={iconFor === 'all' ? null : merged.slots[iconFor].icon}
          uploading={upload.isPending}
          onClose={() => setIconFor(null)}
          onPick={(ref) => {
            if (iconFor !== 'all') setSlot(iconFor, { icon: ref });
            setIconFor(null);
          }}
          onPickSet={(refs) => {
            set(
              'slots',
              Object.fromEntries(
                OPTION_ORDER.map((p, i) => [p.color, { ...merged.slots[p.color], icon: refs[i] }]),
              ),
            );
            setIconFor(null);
          }}
          onUpload={(file) => iconFor !== 'all' && uploadIcon(iconFor, file)}
          onReset={() => {
            if (iconFor !== 'all') setSlot(iconFor, { icon: parentValues.slots[iconFor].icon });
            setIconFor(null);
          }}
        />
      ) : null}
    </section>
  );
}

function FontSection({
  font,
  origin,
  onChange,
  onUpload,
}: {
  font: ThemeOverrides['font'] & object;
  origin: ReactNode;
  onChange: (f: NonNullable<ThemeOverrides['font']>) => void;
  onUpload: (file: File, license: (typeof FONT_LICENSES)[number]) => void;
}) {
  const { t } = useTranslation('themes');
  const [license, setLicense] = useState<(typeof FONT_LICENSES)[number]>('OFL-1.1');
  const fileRef = useRef<HTMLInputElement>(null);
  const current = 'builtin' in font ? font.builtin : 'own';
  return (
    <Disclosure
      title={t('editor.font')}
      rememberAs="theme-font"
      value={current === 'own' ? t('editor.ownFont') : t(`font.${current}`)}
    >
      {origin}
      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium">{t('editor.font')}</span>
        <Select
          className="h-8 w-auto"
          value={current}
          onChange={(e) =>
            e.target.value !== 'own' &&
            onChange({ builtin: e.target.value as (typeof THEME_FONTS)[number] })
          }
        >
          {THEME_FONTS.map((f) => (
            <option key={f} value={f}>
              {t(`font.${f}`)}
            </option>
          ))}
          {current === 'own' ? <option value="own">{t('editor.ownFont')}</option> : null}
        </Select>
      </label>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <input
          ref={fileRef}
          type="file"
          accept=".woff2,font/woff2"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f, license);
            e.target.value = '';
          }}
        />
        <Select
          className="h-8 w-auto"
          value={license}
          aria-label={t('editor.fontLicense')}
          onChange={(e) => setLicense(e.target.value as (typeof FONT_LICENSES)[number])}
        >
          {FONT_LICENSES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          {t('editor.fontUpload')}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">{t('editor.fontHint')}</p>
    </Disclosure>
  );
}
