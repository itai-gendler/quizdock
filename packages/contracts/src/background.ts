import { z } from 'zod';

/** A generated background: 2–4 CSS hex colours along an angle. */
export const gradientSchema = z.object({
  angle: z.number().int().min(0).max(360),
  colors: z
    .array(z.string().regex(/^#[0-9a-fA-F]{6}$/))
    .min(2)
    .max(4),
});

/**
 * How a step lays its background (THEMING §1.1): the parts of the background object that
 * are not the picture or the gradient themselves. Absent: today's cover, veiled for the
 * text tone. Settings the mode does not use are ignored.
 */
export const backgroundStyleSchema = z
  .object({
    mode: z.enum(['watermark', 'cover', 'contain', 'pattern']),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    size: z.number().int().min(5).max(100),
    opacity: z.number().min(0).max(1),
    grayscale: z.boolean(),
    blur: z.number().int().min(0).max(20),
    veil: z.object({
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      opacity: z.number().min(0).max(0.9),
    }),
  })
  .partial()
  .strict();
export type BackgroundStyle = z.infer<typeof backgroundStyleSchema>;

/** Full-cover background of a slide or a question: image or gradient (exclusive) + text contrast. */
export const backgroundFields = {
  backgroundMediaId: z.string().length(26).nullable().optional(),
  backgroundGradient: gradientSchema.nullable().optional(),
  textTone: z.enum(['light', 'dark']).default('light'),
  textOutline: z.boolean().default(true),
  backgroundStyle: backgroundStyleSchema.nullable().optional(),
};

export const backgroundOutputFields = {
  backgroundMediaId: z.string().nullable(),
  backgroundGradient: gradientSchema.nullable(),
  textTone: z.enum(['light', 'dark']),
  textOutline: z.boolean(),
  backgroundStyle: backgroundStyleSchema.nullable(),
};

/** An image or a gradient, never both. */
export const noBackgroundConflict = (d: {
  backgroundMediaId?: string | null;
  backgroundGradient?: unknown;
}) => !(d.backgroundMediaId && d.backgroundGradient);
