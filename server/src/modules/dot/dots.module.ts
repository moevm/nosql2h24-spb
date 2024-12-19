import { Module } from '@nestjs/common';
import { DotsService } from './dots.service';
import { DotsController } from './dots.controller';

@Module({
  controllers: [DotsController],
  providers: [DotsService],
})
export class DotsModule {}
