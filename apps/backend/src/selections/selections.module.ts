import { Module } from '@nestjs/common';
import { GameStateModule } from '../game/game-state.module';
import { SelectionsController } from './selections.controller';
import { SelectionsService } from './selections.service';

/** Selections (SPECIFICATIONS-SELECTION): named lists of quizzes, launched into a room. */
@Module({
  imports: [GameStateModule],
  controllers: [SelectionsController],
  providers: [SelectionsService],
})
export class SelectionsModule {}
