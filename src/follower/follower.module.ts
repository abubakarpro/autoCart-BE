import { Module } from '@nestjs/common';

import { FollowerService } from './follower.service';
import { FollowerController } from './follower.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
