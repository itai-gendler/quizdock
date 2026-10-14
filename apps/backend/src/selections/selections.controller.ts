import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  CreateSelectionDto,
  SelectionDetailDto,
  SelectionDto,
  SelectionFromRoomDto,
  SelectionLaunchDto,
  UpdateSelectionDto,
} from './dto/selection.dto';
import { SelectionsService } from './selections.service';

/**
 * Selections (SPECIFICATIONS-SELECTION): a host's named lists of quizzes, launched
 * into a room in one go. Shared ones are read, launched and copied by the others.
 */
@ApiTags('selections')
@ApiBearerAuth()
@Controller('selections')
export class SelectionsController {
  constructor(private readonly selections: SelectionsService) {}

  @Get()
  @ApiOkResponse({ type: SelectionDto, isArray: true })
  list(@CurrentUser() user: User): Promise<SelectionDto[]> {
    return this.selections.list(user.id);
  }

  @Post()
  @ApiCreatedResponse({ type: SelectionDetailDto })
  create(@CurrentUser() user: User, @Body() dto: CreateSelectionDto): Promise<SelectionDetailDto> {
    return this.selections.create(user.id, dto);
  }

  /** *Save as a selection*: the quizzes a room played, live (`pin`) or archived (`roomId`). */
  @Post('from-room')
  @ApiCreatedResponse({ type: SelectionDetailDto })
  fromRoom(
    @CurrentUser() user: User,
    @Body() dto: SelectionFromRoomDto,
  ): Promise<SelectionDetailDto> {
    return this.selections.fromRoom(user.id, dto);
  }

  @Get(':id')
  @ApiOkResponse({ type: SelectionDetailDto })
  get(@CurrentUser() user: User, @Param('id') id: string): Promise<SelectionDetailDto> {
    return this.selections.get(user.id, id);
  }

  @Put(':id')
  @ApiOkResponse({ type: SelectionDetailDto })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateSelectionDto,
  ): Promise<SelectionDetailDto> {
    return this.selections.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  remove(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    return this.selections.remove(user.id, id);
  }

  /** *Create a selection from this*: the caller's own, on the same quizzes. */
  @Post(':id/duplicate')
  @ApiCreatedResponse({ type: SelectionDetailDto })
  duplicate(@CurrentUser() user: User, @Param('id') id: string): Promise<SelectionDetailDto> {
    return this.selections.duplicate(user.id, id);
  }

  /** Its launches compared, from their archived sessions (its owner only). */
  @Get(':id/launches')
  @ApiOkResponse({ type: SelectionLaunchDto, isArray: true })
  launches(@CurrentUser() user: User, @Param('id') id: string): Promise<SelectionLaunchDto[]> {
    return this.selections.launches(user.id, id);
  }
}
