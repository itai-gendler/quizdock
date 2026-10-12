import { BACKGROUND_MODES, type BackgroundMode, type BackgroundStyle } from '@quiz-dock/contracts';
import { useTranslation } from 'react-i18next';
import { Segmented } from '@/components/ui/segmented';
import { Switch } from '@/components/ui/switch';

/** What a picture is laid as by default: today's cover, veiled for the text tone. */
export const DEFAULT_MODE: BackgroundMode = 'cover';

/**
 * How a background picture is laid (THEMING §1.1), for a step and for a theme alike:
 * its mode, then the settings that mode uses — a veil for a cover, an opacity and a
 * size for the others, a blur and greyscale for all.
 */
export function PictureLayout({
  style,
  onChange,
  textTone,
}: {
  style: BackgroundStyle;
  onChange: (next: BackgroundStyle) => void;
  /** The veil a cover gets by default follows the text: dark under light text. */
  textTone: 'light' | 'dark';
}) {
  const { t } = useTranslation('themes');
  const mode = style.mode ?? DEFAULT_MODE;
  const veil = style.veil ?? {
    color: textTone === 'light' ? '#000000' : '#ffffff',
    opacity: textTone === 'light' ? 0.4 : 0.55,
  };
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">{t('layout.legend')}</span>
      <Segmented
        className="w-fit flex-wrap"
        label={t('layout.legend')}
        value={mode}
        onChange={(m) => onChange({ ...style, mode: m })}
        options={BACKGROUND_MODES.map((m) => ({ value: m, label: t(`layout.mode.${m}`) }))}
      />
      {mode === 'cover' ? (
        <>
          <ColorRow
            label={t('layout.veil')}
            value={veil.color}
            onChange={(color) => onChange({ ...style, veil: { ...veil, color } })}
          />
          <Range
            label={t('layout.veilOpacity')}
            min={0}
            max={0.9}
            step={0.05}
            value={veil.opacity}
            format={(v) => `${Math.round(v * 100)} %`}
            onChange={(opacity) => onChange({ ...style, veil: { ...veil, opacity } })}
          />
        </>
      ) : (
        <Range
          label={t('layout.opacity')}
          min={0}
          max={1}
          step={0.05}
          value={style.opacity ?? 1}
          format={(v) => `${Math.round(v * 100)} %`}
          onChange={(opacity) => onChange({ ...style, opacity })}
        />
      )}
      {mode === 'watermark' || mode === 'pattern' ? (
        <Range
          label={mode === 'pattern' ? t('layout.tileSize') : t('layout.size')}
          min={5}
          max={100}
          step={1}
          value={style.size ?? (mode === 'pattern' ? 20 : 40)}
          format={(v) => `${v} %`}
          onChange={(size) => onChange({ ...style, size })}
        />
      ) : null}
      <Range
        label={t('layout.blur')}
        min={0}
        max={20}
        step={1}
        value={style.blur ?? 0}
        format={(v) => String(v)}
        onChange={(blur) => onChange({ ...style, blur })}
      />
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={!!style.grayscale}
          onCheckedChange={(grayscale) => onChange({ ...style, grayscale })}
          aria-label={t('layout.grayscale')}
        />
        {t('layout.grayscale')}
      </label>
    </div>
  );
}

export function Range({
  label,
  min,
  max,
  step,
  value,
  format,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-w-0 flex-1"
      />
      <span className="w-12 text-right tabular-nums">{format(value)}</span>
    </label>
  );
}

export function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="size-9 cursor-pointer rounded-md border p-0.5"
      />
      <span>{label}</span>
      <span className="text-muted-foreground font-mono text-xs">{value}</span>
    </label>
  );
}
