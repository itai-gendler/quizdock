import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';

@Module({
  imports: [MediaModule],
  controllers: [ThemesController],
  providers: [ThemesService],
  exports: [ThemesService],
})
export class ThemesModule {}
