import { z } from 'zod';
import { gradientSchema } from './background';
import { OPTION_COLORS } from './question-content';
import { HEX_COLOR } from './theme-color';

/**
 * Quiz themes (THEMING §1–2): the look of a quiz on the live screens. A theme is a
 * shipped theme (`BUILTIN_THEMES`) or a user theme: the child of a shipped one, storing
 * only what it overrides. Every setting is bounded (validation level 1).
 *
 * The schemas are built over the way an asset is referenced: a media id in the API and
 * the database, a `media/…` path in a bundle.
 */

const hex = z.string().regex(HEX_COLOR);

/** How a background picture is laid out (THEMING §1.1). */
export const BACKGROUND_MODES = ['watermark', 'cover', 'contain', 'pattern'] as const;
export type BackgroundMode = (typeof BACKGROUND_MODES)[number];

/** The room effects a theme may replace (THEMING §2.1). */
export const THEME_SOUNDS = ['ding', 'tick', 'countdown', 'gong'] as const;
export type ThemeSound = (typeof THEME_SOUNDS)[number];

/** Motion styles: each sets the live motion tokens (UI-SYSTEM §1.8). `standard` is today's. */
export const MOTION_STYLES = ['standard', 'sober', 'dynamic', 'festive'] as const;
export type MotionStyle = (typeof MOTION_STYLES)[number];

/** Effects played over the reveal, on the projection only (THEMING §2.5). */
export const REVEAL_EFFECTS = ['confetti'] as const;
export type RevealEffect = (typeof REVEAL_EFFECTS)[number];

/** What marks an answer besides its colour: the slot's icon, or its letter or number. */
export const SLOT_MARKERS = ['icons', 'letters', 'numbers'] as const;
export type SlotMarkers = (typeof SLOT_MARKERS)[number];

/** Fonts shipped in the image (THEMING §1.3); `system` is the device's own. */
export const THEME_FONTS = [
  'system',
  'atkinson',
  'lexend',
  'nunito',
  'fredoka',
  'inter',
  'bitter',
  'comic-neue',
] as const;
export type ThemeFont = (typeof THEME_FONTS)[number];

/** Licences an imported font may carry (THEMING §6). */
export const FONT_LICENSES = ['OFL-1.1', 'CC0-1.0', 'CC-BY-4.0', 'CC-BY-SA-4.0'] as const;

/** The shipped themes, read-only and the parents of every user theme (THEMING §2.3). */
export const BUILTIN_THEMES = [
  'classic',
  'sober',
  'kids',
  'festive',
  'night',
  'high-contrast',
  'halloween',
  'christmas',
  'new-year',
  'easter',
  'summer',
] as const;
export type BuiltinTheme = (typeof BUILTIN_THEMES)[number];
export const DEFAULT_THEME: BuiltinTheme = 'classic';

/** A theme's answer slot, keyed by today's colour names. */
export type ThemeSlotName = (typeof OPTION_COLORS)[number];

export const THEME_NAME_MAX = 60;

/**
 * The background object (THEMING §1.1): a picture laid out by `mode`, or a gradient,
 * always on a base `color`, with the tone of the text laid on it. Settings a mode does
 * not use are ignored.
 */
export function backgroundSchema<R extends z.ZodType<string>>(ref: R) {
  return z
    .object({
      color: hex,
      textTone: z.enum(['light', 'dark']),
      image: ref.optional(),
      mode: z.enum(BACKGROUND_MODES).optional(),
      gradient: gradientSchema.optional(),
      /** `watermark`: % of the screen's short side; `pattern`: tile, same unit. */
      size: z.number().int().min(5).max(100).optional(),
      opacity: z.number().min(0).max(1).optional(),
      grayscale: z.boolean().optional(),
      /** Blur radius, in thousandths of the screen's short side. */
      blur: z.number().int().min(0).max(20).optional(),
      /** `cover`: a colour laid over the picture, to keep the text readable. */
      veil: z.object({ color: hex, opacity: z.number().min(0).max(0.9) }).optional(),
    })
    .refine((b) => !(b.image && b.gradient), { message: 'background.image_and_gradient' })
    .refine((b) => !b.image || b.mode, { message: 'background.mode_required', path: ['mode'] });
}

/** A slot: its colour, and its icon (null: the slot's shipped glyph). */
export function slotSchema<R extends z.ZodType<string>>(ref: R) {
  return z.object({ color: hex, icon: ref.nullable() });
}

export function fontSchema<R extends z.ZodType<string>>(ref: R) {
  return z.union([
    z.object({ builtin: z.enum(THEME_FONTS) }).strict(),
    z.object({ file: ref, license: z.enum(FONT_LICENSES) }).strict(),
  ]);
}

export const motionSchema = z.object({
  style: z.enum(MOTION_STYLES),
  revealEffect: z.enum(REVEAL_EFFECTS).nullable(),
});

/** What a user theme overrides of its parent: any part, any subset of the slots. */
export function themeOverridesSchema<R extends z.ZodType<string>>(ref: R) {
  return z
    .object({
      background: backgroundSchema(ref),
      slots: z.partialRecord(z.enum(OPTION_COLORS), slotSchema(ref)),
      accent: hex,
      font: fontSchema(ref),
      sounds: z.partialRecord(z.enum(THEME_SOUNDS), ref),
      motion: motionSchema,
      markers: z.enum(SLOT_MARKERS),
    })
    .partial()
    .strict();
}

/** A media id, as the API and the database reference an asset. */
const mediaId = z.string().length(26);
export const themeOverridesInput = themeOverridesSchema(mediaId);
export type ThemeOverrides = z.infer<typeof themeOverridesInput>;
export type ThemeBackground = NonNullable<ThemeOverrides['background']>;
export type ThemeSlot = z.infer<ReturnType<typeof slotSchema<typeof mediaId>>>;
export type ThemeFontValue = NonNullable<ThemeOverrides['font']>;
export type ThemeMotion = z.infer<typeof motionSchema>;

/** A theme with every part set: a shipped theme, or a user theme merged onto its parent. */
export interface ThemeValues {
  background: ThemeBackground;
  slots: Record<ThemeSlotName, ThemeSlot>;
  accent: string;
  font: ThemeFontValue;
  sounds: Partial<Record<ThemeSound, string>>;
  motion: ThemeMotion;
  /** What marks an answer besides its colour (never the colour alone). */
  markers: SlotMarkers;
}

/** A user theme's values: its parent's, each part replaced by what it overrides. */
export function mergeTheme(parent: ThemeValues, overrides: ThemeOverrides): ThemeValues {
  return {
    background: overrides.background ?? parent.background,
    slots: { ...parent.slots, ...overrides.slots } as ThemeValues['slots'],
    accent: overrides.accent ?? parent.accent,
    font: overrides.font ?? parent.font,
    sounds: { ...parent.sounds, ...overrides.sounds },
    motion: overrides.motion ?? parent.motion,
    markers: overrides.markers ?? parent.markers,
  };
}

/**
 * The same overrides, each file reference passed through `map`: media ids to bundle
 * paths at export, and back at import. A reference `map` drops (undefined) is left out.
 */
export function mapThemeRefs(
  overrides: ThemeOverrides,
  map: (ref: string) => string | undefined,
): ThemeOverrides {
  const out: ThemeOverrides = { ...overrides };
  if (overrides.background) {
    const { image, ...rest } = overrides.background;
    const mapped = image ? map(image) : undefined;
    out.background = mapped ? { ...rest, image: mapped } : rest;
  }
  if (overrides.slots) {
    out.slots = Object.fromEntries(
      Object.entries(overrides.slots).map(([name, slot]) => [
        name,
        slot && { color: slot.color, icon: slot.icon ? (map(slot.icon) ?? null) : null },
      ]),
    );
  }
  if (overrides.font && 'file' in overrides.font) {
    const file = map(overrides.font.file);
    if (file) out.font = { ...overrides.font, file };
    else delete out.font;
  }
  if (overrides.sounds) {
    out.sounds = Object.fromEntries(
      Object.entries(overrides.sounds).flatMap(([k, ref]) => {
        const mapped = ref ? map(ref) : undefined;
        return mapped ? [[k, mapped]] : [];
      }),
    );
  }
  return out;
}

/** Every media id a theme's overrides point to: its icons, font, sounds and picture. */
export function themeMediaIds(overrides: ThemeOverrides): string[] {
  const ids = new Set<string>();
  if (overrides.background?.image) ids.add(overrides.background.image);
  for (const slot of Object.values(overrides.slots ?? {})) if (slot?.icon) ids.add(slot.icon);
  if (overrides.font && 'file' in overrides.font) ids.add(overrides.font.file);
  for (const id of Object.values(overrides.sounds ?? {})) if (id) ids.add(id);
  return [...ids];
}

/**
 * A theme as the live screens receive it (THEMING §2.6): every file it points to given
 * by its URL. A file missing from `urls` is dropped: the part falls back to no picture,
 * the option's shape, the shipped font, the synthesised effect.
 */
export function themeWithUrls(values: ThemeValues, urls: Record<string, string>): ThemeValues {
  const url = (id: string | null | undefined) => (id ? urls[id] : undefined);
  const { image, ...background } = values.background;
  const bgImage = url(image);
  const font = values.font;
  const fontFile = 'file' in font ? url(font.file) : undefined;
  return {
    ...values,
    background: bgImage ? { ...background, image: bgImage } : background,
    slots: Object.fromEntries(
      Object.entries(values.slots).map(([name, slot]) => [
        name,
        { color: slot.color, icon: url(slot.icon) ?? null },
      ]),
    ) as ThemeValues['slots'],
    font: 'file' in font ? (fontFile ? { ...font, file: fontFile } : { builtin: 'system' }) : font,
    sounds: Object.fromEntries(
      Object.entries(values.sounds).flatMap(([k, id]) => (url(id) ? [[k, url(id)]] : [])),
    ),
  };
}
