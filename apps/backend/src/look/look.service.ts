import { Injectable } from '@nestjs/common';
import { OperationError } from '../admin/operations/operation';
import type { MediaKind } from '@prisma/client';
import {
  DEFAULT_LOOK,
  type InterfaceLook,
  interfaceLookSchema,
  isShippedPicture,
  shippedPictureUrl,
  linkOnDark,
} from '@quiz-dock/contracts';
import { mediaUrl } from '../media/media.config';
import { PrismaService } from '../prisma/prisma.service';

/** Where the instance's look is kept (`instance_setting`). */
export const LOOK_KEY = 'look.interface';

/** The look as a browser applies it: files by URL, and the link colour on the dark page. */
export type ResolvedLook = InterfaceLook & {
  linkDark: string;
  fontUrl: string | null;
  pictureUrl: string | null;
};

/** Who changes the look: the operation's actor. */
export interface LookAuthor {
  name: string;
  userId?: string;
}

/**
 * The instance's look (THEMING lot 2): kept in the database, changed through the
 * `look.*` operations, given to every page through `/config.js`. Its files — an
 * imported font, a showcase picture — are made instance media, never swept.
 */
@Injectable()
export class LookService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<InterfaceLook> {
    const row = await this.prisma.instanceSetting.findUnique({ where: { key: LOOK_KEY } });
    if (!row) return DEFAULT_LOOK;
    try {
      const parsed = interfaceLookSchema.safeParse(JSON.parse(row.value));
      return parsed.success ? parsed.data : DEFAULT_LOOK;
    } catch {
      return DEFAULT_LOOK;
    }
  }

  async resolved(): Promise<ResolvedLook> {
    const look = await this.get();
    const font = 'file' in look.font ? mediaUrl(look.font.file) : null;
    const image = look.showcase.picture?.image;
    const picture = !image
      ? null
      : isShippedPicture(image)
        ? shippedPictureUrl(image)
        : mediaUrl(image);
    return { ...look, linkDark: linkOnDark(look.accent), fontUrl: font, pictureUrl: picture };
  }

  async set(author: LookAuthor, input: unknown): Promise<InterfaceLook> {
    const parsed = interfaceLookSchema.safeParse(input);
    if (!parsed.success) throw new OperationError('invalid_params', 'Not a look.');
    const look = parsed.data;
    const files: [string, MediaKind][] = [];
    if ('file' in look.font) files.push([look.font.file, 'font']);
    const image = look.showcase.picture?.image;
    if (image && !isShippedPicture(image)) files.push([image, 'image']);
    for (const [id, kind] of files) {
      const media = await this.prisma.mediaAsset.findUnique({ where: { id } });
      if (!media || media.kind !== kind) {
        throw new OperationError('invalid_params', `No ${kind} ${id} in the media.`);
      }
      // The instance's own from now on: kept whoever uploaded it.
      if (!media.instance)
        await this.prisma.mediaAsset.update({ where: { id }, data: { instance: true } });
    }
    const value = JSON.stringify(look);
    const by = { updatedBy: author.name, userId: author.userId ?? null };
    await this.prisma.instanceSetting.upsert({
      where: { key: LOOK_KEY },
      create: { key: LOOK_KEY, value, ...by },
      update: { value, ...by },
    });
    return look;
  }

  /** Back to QuizDock's own look. */
  async reset(): Promise<InterfaceLook> {
    await this.prisma.instanceSetting.deleteMany({ where: { key: LOOK_KEY } });
    return DEFAULT_LOOK;
  }
}
