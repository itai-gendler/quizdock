import {
  ACCESSIBILITY_CHECKS,
  ACCESSIBILITY_STATUSES,
  BUILTIN_THEMES,
  THEME_NAME_MAX,
  themeOverridesInput,
} from '@quiz-dock/contracts';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { OPTION_COLORS } from '@quiz-dock/contracts';

export const accessibilitySchema = z.object({
  status: z.enum(ACCESSIBILITY_STATUSES),
  checks: z.array(
    z.object({
      code: z.enum(ACCESSIBILITY_CHECKS),
      passed: z.boolean(),
      slots: z.array(z.enum(OPTION_COLORS)).optional(),
      vision: z.enum(['protanopia', 'deuteranopia', 'tritanopia']).optional(),
    }),
  ),
});

/** A theme of the library (THEMING §2.3), with the files its overrides point to. */
export const themeSchema = z.object({
  id: z.string(),
  name: z.string(),
  parent: z.enum(BUILTIN_THEMES),
  overrides: themeOverridesInput,
  accessibility: accessibilitySchema,
  owner: z.object({ id: z.string(), name: z.string() }),
  /** Its owner or an administrator: may edit and delete it. */
  canEdit: z.boolean(),
  /** How many quizzes use it: one in use cannot be deleted. */
  quizCount: z.number().int(),
  /** The instance's default theme: cannot be deleted either. */
  isDefault: z.boolean(),
  /** Each file its overrides point to, by media id. */
  media: z.record(z.string(), z.object({ url: z.string(), name: z.string().nullable() })),
  updatedAt: z.string(),
});
export class ThemeDto extends createZodDto(themeSchema) {}

export const themeListSchema = z.object({
  themes: z.array(themeSchema),
  /** The instance's default theme: a shipped one by its key, or a theme of the library. */
  defaultTheme: z.object({
    builtin: z.enum(BUILTIN_THEMES).optional(),
    id: z.string().optional(),
  }),
});
export class ThemeListDto extends createZodDto(themeListSchema) {}

const name = z.string().trim().min(1).max(THEME_NAME_MAX);

export const createThemeSchema = z.object({
  name,
  parent: z.enum(BUILTIN_THEMES),
  overrides: themeOverridesInput.default({}),
});
export class CreateThemeDto extends createZodDto(createThemeSchema) {}

export const updateThemeSchema = z.object({
  name: name.optional(),
  parent: z.enum(BUILTIN_THEMES).optional(),
  overrides: themeOverridesInput.optional(),
});
export class UpdateThemeDto extends createZodDto(updateThemeSchema) {}

export const duplicateThemeSchema = z.object({ name });
export class DuplicateThemeDto extends createZodDto(duplicateThemeSchema) {}

/**
 * A quiz's theme, or the instance's default: a shipped one by its key (`builtin`), or one
 * of the library (`id`), exactly one of the two.
 */
export const themeRefSchema = z
  .object({ builtin: z.enum(BUILTIN_THEMES).optional(), id: z.string().length(26).optional() })
  .strict()
  .refine((r) => (r.builtin === undefined) !== (r.id === undefined), {
    message: 'theme.ref_one_of',
  });
export class ThemeRefDto extends createZodDto(themeRefSchema) {}

export const themeAssetResultSchema = z.object({
  mediaId: z.string(),
  url: z.string(),
  /** An icon drew with strokes, dropped: it may look different from the file. */
  strokeRemoved: z.boolean(),
});
export class ThemeAssetResultDto extends createZodDto(themeAssetResultSchema) {}
