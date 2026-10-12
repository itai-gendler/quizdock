import { Module } from '@nestjs/common';
import { LookService } from './look.service';

@Module({
  providers: [LookService],
  exports: [LookService],
})
export class LookModule {}
