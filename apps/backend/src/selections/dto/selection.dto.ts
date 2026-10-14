import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { SELECTION_ITEMS_MAX } from '../selection-access';

const name = z.string().trim().min(1).max(60);
const description = z.string().trim().max(2000);

/** A selection as a list shows it (SPECIFICATIONS-SELECTION). */
export const selectionSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  /** Shared with the instance's other hosts: they read it, launch it, or create from it. */
  shared: z.boolean(),
  /** Whether the caller may edit it: theirs. */
  editable: z.boolean(),
  /** Its owner's name, on another host's selection. */
  ownerName: z.string().optional(),
  /** The quizzes the caller may read, and those of them they may play. */
  quizCount: z.number().int(),
  playableCount: z.number().int(),
  /** Its first quizzes the caller may read (three at most), to picture it as a fan. */
  preview: z.array(z.object({ quizId: z.string(), coverMediaId: z.string().nullable() })),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export class SelectionDto extends createZodDto(selectionSchema) {}

/** One quiz of a selection, as the caller may read it. */
export const selectionItemSchema = z.object({
  quizId: z.string(),
  title: z.string(),
  /** Its owner's name, for another host's quiz. */
  ownerName: z.string().optional(),
  status: z.enum(['draft', 'ready', 'archived']),
  questionCount: z.number().int(),
  mode: z.enum(['manual', 'auto']),
  autoStart: z.boolean(),
  /** Why it cannot be played; null when it can. */
  unplayable: z.enum(['draft', 'archived', 'empty']).nullable(),
});

export const selectionDetailSchema = selectionSchema.extend({
  items: z.array(selectionItemSchema),
  /** On the owner's own selection: how many of its quizzes the other hosts would not see (not shared). */
  unsharedCount: z.number().int().optional(),
});
export class SelectionDetailDto extends createZodDto(selectionDetailSchema) {}

export class CreateSelectionDto extends createZodDto(
  z.object({ name, description: description.optional() }),
) {}

const itemInput = z.object({
  quizId: z.string().min(1).max(64),
  mode: z.enum(['manual', 'auto']).default('manual'),
  autoStart: z.boolean().default(true),
});

export class UpdateSelectionDto extends createZodDto(
  z.object({
    name: name.optional(),
    description: description.nullable().optional(),
    shared: z.boolean().optional(),
    /** The quizzes the owner sees, in their new order; those they cannot see keep their place. */
    items: z.array(itemInput).max(SELECTION_ITEMS_MAX).optional(),
  }),
) {}

export class SelectionFromRoomDto extends createZodDto(
  z.object({
    /** A live room the caller hosts (the console), or… */
    pin: z
      .string()
      .regex(/^\d{6}$/)
      .optional(),
    /** …a room of their archived sessions (History). */
    roomId: z.string().min(1).max(64).optional(),
    name: name.optional(),
  }),
) {}

/** One launch of a selection: a room opened from it, read from its archived sessions. */
export const selectionLaunchSchema = z.object({
  roomId: z.string(),
  roomName: z.string().nullable(),
  startedAt: z.string(),
  /** The most participants of any of its quizzes. */
  participants: z.number().int(),
  sessions: z.array(
    z.object({
      id: z.string(),
      quizId: z.string(),
      quizTitle: z.string(),
      playerCount: z.number().int(),
      /** Share of right answers, 0..1; null when nobody answered. */
      successRate: z.number().nullable(),
    }),
  ),
});
export class SelectionLaunchDto extends createZodDto(selectionLaunchSchema) {}
