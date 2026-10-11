import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { AllowManager } from '../auth/allow-manager.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ManagerOnly } from '../auth/manager-only.decorator';
import { FileUpload } from '../common/file-upload.interceptor';
import {
  CreateThemeDto,
  DuplicateThemeDto,
  ThemeAssetResultDto,
  ThemeDto,
  ThemeListDto,
  ThemeRefDto,
  UpdateThemeDto,
} from './dto/theme.dto';
import { FONT_MAX_BYTES } from './theme-assets';
import { ThemesService, toThemeRef } from './themes.service';

enum ThemeAssetKind {
  icon = 'icon',
  font = 'font',
}

/**
 * The library of quiz themes (THEMING §2.3). Every host lists and uses every theme;
 * its owner and the administrators edit it.
 */
@ApiTags('themes')
@ApiBearerAuth()
@Controller('themes')
export class ThemesController {
  constructor(private readonly themes: ThemesService) {}

  @Get()
  @AllowManager()
  @ApiOkResponse({ type: ThemeListDto })
  list(@CurrentUser() user: User): Promise<ThemeListDto> {
    return this.themes.list(user);
  }

  /** The instance's default theme, for the quizzes that pick none (admin only). */
  @Put('default')
  @ManagerOnly()
  @ApiOkResponse({ type: ThemeListDto })
  setDefault(@CurrentUser() user: User, @Body() body: ThemeRefDto): Promise<ThemeListDto> {
    return this.themes.setDefault(user, toThemeRef(body));
  }

  /** A theme's own file: a monochrome SVG icon (sanitised) or a woff2 font. */
  @Post('assets/:kind')
  @AllowManager()
  @ApiParam({ name: 'kind', enum: ThemeAssetKind })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({ type: ThemeAssetResultDto })
  @UseInterceptors(FileUpload('file', () => FONT_MAX_BYTES))
  uploadAsset(
    @CurrentUser() user: User,
    @Param('kind', new ParseEnumPipe(ThemeAssetKind)) kind: ThemeAssetKind,
    @UploadedFile() file: { buffer: Buffer; originalname?: string } | undefined,
  ): Promise<ThemeAssetResultDto> {
    return this.themes.uploadAsset(user, kind, file);
  }

  @Get(':id')
  @AllowManager()
  @ApiOkResponse({ type: ThemeDto })
  get(@CurrentUser() user: User, @Param('id') id: string): Promise<ThemeDto> {
    return this.themes.get(user, id);
  }

  @Post()
  @AllowManager()
  @ApiCreatedResponse({ type: ThemeDto })
  create(@CurrentUser() user: User, @Body() body: CreateThemeDto): Promise<ThemeDto> {
    return this.themes.create(user, body);
  }

  @Put(':id')
  @AllowManager()
  @ApiOkResponse({ type: ThemeDto })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateThemeDto,
  ): Promise<ThemeDto> {
    return this.themes.update(user, id, body);
  }

  @Post(':id/duplicate')
  @AllowManager()
  @ApiCreatedResponse({ type: ThemeDto })
  duplicate(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: DuplicateThemeDto,
  ): Promise<ThemeDto> {
    return this.themes.duplicate(user, id, body.name);
  }

  /** Refused (409) while a quiz uses it or it is the instance's default. */
  @Delete(':id')
  @AllowManager()
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiResponse({ status: 409, description: 'Used by a quiz, or the default theme.' })
  remove(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    return this.themes.remove(user, id);
  }
}
