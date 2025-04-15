import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService]
})
export class StoryModule {}
