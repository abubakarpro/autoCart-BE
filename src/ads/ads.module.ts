import { Module } from '@nestjs/common';

import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StoryModule } from '../story/story.module';

@Module({
  imports: [PrismaModule, StoryModule],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
