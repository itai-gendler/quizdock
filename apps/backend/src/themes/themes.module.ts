import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { ThemesController } from './themes.controller';
import { ThemePortableService } from './theme-portable.service';
import { ThemesService } from './themes.service';

@Module({
  imports: [MediaModule],
  controllers: [ThemesController],
  providers: [ThemesService, ThemePortableService],
  exports: [ThemesService, ThemePortableService],
})
export class ThemesModule {}
