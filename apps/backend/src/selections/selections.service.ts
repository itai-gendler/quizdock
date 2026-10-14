import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Selection } from '@prisma/client';
import type { GameMode } from '@quiz-dock/contracts';
import { GameService } from '../game/game.service';
import { PrismaService } from '../prisma/prisma.service';
import { readableBy } from '../quizzes/quiz-access';
import type {
  CreateSelectionDto,
  SelectionDetailDto,
  SelectionDto,
  SelectionLaunchDto,
  UpdateSelectionDto,
} from './dto/selection.dto';
import {
  SELECTION_ITEMS_MAX,
  type SelectionLine,
  linesOf,
  visibleSelection,
} from './selection-access';

type ItemInput = { quizId: string; mode: GameMode; autoStart: boolean };

/** The quizzes a selection's picture fans out. */
const PREVIEW_MAX = 3;

/**
 * Selections (SPECIFICATIONS-SELECTION): named lists of quizzes, launched into a room.
 * Everyone sees of one what they may read; the owner alone changes it.
 */
@Injectable()
export class SelectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly game: GameService,
  ) {}

  /** The caller's selections, and the shared ones they may read something of. */
  async list(userId: string): Promise<SelectionDto[]> {
    const rows = await this.prisma.selection.findMany({
      where: visibleSelection(userId),
      orderBy: { updatedAt: 'desc' },
      include: { owner: { select: { displayName: true } } },
    });
    return Promise.all(
      rows.map(async (row) =>
        this.summary(
          row,
          row.owner.displayName,
          userId,
          await linesOf(this.prisma, row.id, userId),
        ),
      ),
    );
  }

  async get(userId: string, id: string): Promise<SelectionDetailDto> {
    const row = await this.findVisible(userId, id);
    return this.detail(row, userId);
  }

  async create(userId: string, dto: CreateSelectionDto): Promise<SelectionDetailDto> {
    const row = await this.prisma.selection.create({
      data: { ownerId: userId, name: dto.name, description: dto.description || null },
    });
    return this.detail(row, userId);
  }

  async update(userId: string, id: string, dto: UpdateSelectionDto): Promise<SelectionDetailDto> {
    const row = await this.findOwned(userId, id);
    const items = dto.items ? await this.mergedItems(userId, row.id, dto.items) : null;
    const updated = await this.prisma.$transaction(async (tx) => {
      if (items) {
        await tx.selectionItem.deleteMany({ where: { selectionId: row.id } });
        await tx.selectionItem.createMany({
          data: items.map((item, orderIndex) => ({ ...item, selectionId: row.id, orderIndex })),
        });
      }
      return tx.selection.update({
        where: { id: row.id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.description !== undefined ? { description: dto.description || null } : {}),
          ...(dto.shared !== undefined ? { shared: dto.shared } : {}),
          // Its list changed: the selection did too.
          ...(items ? { updatedAt: new Date() } : {}),
        },
      });
    });
    return this.detail(updated, userId);
  }

  async remove(userId: string, id: string): Promise<void> {
    const row = await this.findOwned(userId, id);
    await this.prisma.selection.delete({ where: { id: row.id } });
  }

  /** *Create a selection from this*: the caller's own, on the quizzes they may read — copying none. */
  async duplicate(userId: string, id: string): Promise<SelectionDetailDto> {
    const source = await this.findVisible(userId, id);
    const lines = await linesOf(this.prisma, source.id, userId);
    return this.createWith(userId, source.name, source.description, lines);
  }

  /**
   * *Save as a selection*: the quizzes a room played, in order — from its console (`pin`,
   * every quiz played with its pace) or from *History* (`roomId`, the archived ones,
   * at the manual pace). What the caller may not read is left out.
   */
  async fromRoom(
    userId: string,
    from: { pin?: string; roomId?: string; name?: string },
  ): Promise<SelectionDetailDto> {
    let played: { quizId: string; mode: GameMode }[];
    let roomName: string | null;
    if (from.pin) {
      const room = await this.game.getRoom(from.pin);
      if (!room || room.hostUserId !== userId) throw new NotFoundException('session.not_found');
      played = await this.game.playedOrder(from.pin);
      roomName = room.name || null;
    } else if (from.roomId) {
      const sessions = await this.prisma.gameSessionLog.findMany({
        where: { roomId: from.roomId, hostId: userId },
        orderBy: { startedAt: 'asc' },
        select: { quizId: true, roomName: true },
      });
      if (sessions.length === 0) throw new NotFoundException('session.not_found');
      played = [...new Set(sessions.map((s) => s.quizId))].map((quizId) => ({
        quizId,
        mode: 'manual' as const,
      }));
      roomName = sessions[0].roomName;
    } else {
      throw new BadRequestException('validation');
    }
    const readable = new Set(
      (
        await this.prisma.quiz.findMany({
          where: { id: { in: played.map((p) => p.quizId) }, ...readableBy(userId) },
          select: { id: true },
        })
      ).map((q) => q.id),
    );
    const items = played
      .filter((p) => readable.has(p.quizId))
      .slice(0, SELECTION_ITEMS_MAX)
      .map((p) => ({ ...p, autoStart: true }));
    if (items.length === 0) throw new BadRequestException('selection.nothing_to_save');
    const host = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { displayName: true },
    });
    const name = (from.name ?? roomName ?? host?.displayName ?? '').slice(0, 60) || 'Selection';
    return this.createWith(userId, name, null, items);
  }

  /** Its launches by its owner, newest first, read from their archived sessions. */
  async launches(userId: string, id: string): Promise<SelectionLaunchDto[]> {
    const row = await this.findOwned(userId, id);
    const sessions = await this.prisma.gameSessionLog.findMany({
      where: { selectionId: row.id, hostId: userId },
      orderBy: { startedAt: 'asc' },
      select: {
        id: true,
        quizId: true,
        roomId: true,
        roomName: true,
        startedAt: true,
        playerCount: true,
        successRate: true,
        quizSnapshot: true,
      },
    });
    const rooms = new Map<string, SelectionLaunchDto>();
    for (const s of sessions) {
      const key = s.roomId ?? s.id;
      const launch = rooms.get(key) ?? {
        roomId: key,
        roomName: s.roomName,
        startedAt: s.startedAt.toISOString(),
        participants: 0,
        sessions: [],
      };
      launch.participants = Math.max(launch.participants, s.playerCount);
      launch.sessions.push({
        id: s.id,
        quizId: s.quizId,
        quizTitle: ((s.quizSnapshot ?? {}) as { title?: string }).title ?? '',
        playerCount: s.playerCount,
        successRate: s.successRate === null ? null : Number(s.successRate),
      });
      rooms.set(key, launch);
    }
    return [...rooms.values()].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }

  private async createWith(
    userId: string,
    name: string,
    description: string | null,
    items: Pick<SelectionLine, 'quizId' | 'mode' | 'autoStart'>[],
  ): Promise<SelectionDetailDto> {
    const row = await this.prisma.selection.create({
      data: {
        ownerId: userId,
        name,
        description,
        items: {
          create: items.map(({ quizId, mode, autoStart }, orderIndex) => ({
            quizId,
            mode,
            autoStart,
            orderIndex,
          })),
        },
      },
    });
    return this.detail(row, userId);
  }

  /**
   * The full list once the owner reorders what they see: the quizzes they cannot read
   * (another host's, no longer shared) keep their place after the one they followed —
   * never lost because they were not shown.
   */
  private async mergedItems(
    userId: string,
    selectionId: string,
    visible: ItemInput[],
  ): Promise<ItemInput[]> {
    const ids = visible.map((i) => i.quizId);
    if (new Set(ids).size !== ids.length) throw new BadRequestException('selection.duplicate_quiz');
    const readable = await this.prisma.quiz.count({
      where: { id: { in: ids }, ...readableBy(userId) },
    });
    if (readable !== ids.length) throw new BadRequestException('selection.quiz_not_found');
    const current = await this.prisma.selectionItem.findMany({
      where: { selectionId },
      orderBy: { orderIndex: 'asc' },
      include: { quiz: { select: { ownerId: true, shared: true, status: true } } },
    });
    const canRead = (q: { ownerId: string; shared: boolean; status: string }) =>
      q.ownerId === userId || (q.shared && q.status !== 'archived');
    // Each hidden quiz, after the visible one before it (null: at the start).
    const after = new Map<string | null, ItemInput[]>();
    let anchor: string | null = null;
    for (const item of current) {
      if (canRead(item.quiz)) {
        anchor = item.quizId;
        continue;
      }
      if (ids.includes(item.quizId)) continue;
      const hidden = {
        quizId: item.quizId,
        mode: item.mode as GameMode,
        autoStart: item.autoStart,
      };
      after.set(anchor, [...(after.get(anchor) ?? []), hidden]);
    }
    const merged: ItemInput[] = [...(after.get(null) ?? [])];
    for (const item of visible) {
      merged.push(item, ...(after.get(item.quizId) ?? []));
      after.delete(item.quizId);
    }
    after.delete(null);
    for (const rest of after.values()) merged.push(...rest); // their anchor left the list
    if (merged.length > SELECTION_ITEMS_MAX) {
      throw new BadRequestException('selection.too_many_quizzes');
    }
    return merged;
  }

  private async findVisible(userId: string, id: string) {
    const row = await this.prisma.selection.findFirst({
      where: { id, ...visibleSelection(userId) },
      include: { owner: { select: { displayName: true } } },
    });
    if (!row) throw new NotFoundException('selection.not_found');
    return row;
  }

  /** Someone else's is not even said to exist (404, as a quiz). */
  private async findOwned(userId: string, id: string) {
    const row = await this.prisma.selection.findFirst({ where: { id, ownerId: userId } });
    if (!row) throw new NotFoundException('selection.not_found');
    return row;
  }

  private async detail(row: Selection, userId: string): Promise<SelectionDetailDto> {
    const lines = await linesOf(this.prisma, row.id, userId);
    const own = row.ownerId === userId;
    const owner = own
      ? null
      : await this.prisma.user.findUnique({
          where: { id: row.ownerId },
          select: { displayName: true },
        });
    return {
      ...this.summary(row, owner?.displayName ?? '', userId, lines),
      items: lines.map((l) => ({
        quizId: l.quizId,
        title: l.title,
        ...(l.ownerId === userId ? {} : { ownerName: l.ownerName }),
        status: l.status,
        questionCount: l.questionCount,
        mode: l.mode,
        autoStart: l.autoStart,
        unplayable: l.unplayable,
      })),
      ...(own
        ? {
            unsharedCount: await this.prisma.selectionItem.count({
              where: { selectionId: row.id, quiz: { shared: false } },
            }),
          }
        : {}),
    };
  }

  private summary(
    row: Selection,
    ownerName: string,
    userId: string,
    lines: SelectionLine[],
  ): SelectionDto {
    const editable = row.ownerId === userId;
    return {
      id: row.id,
      ownerId: row.ownerId,
      name: row.name,
      description: row.description,
      shared: row.shared,
      editable,
      ...(editable ? {} : { ownerName }),
      quizCount: lines.length,
      playableCount: lines.filter((l) => l.unplayable === null).length,
      preview: lines
        .slice(0, PREVIEW_MAX)
        .map((l) => ({ quizId: l.quizId, coverMediaId: l.coverMediaId })),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
