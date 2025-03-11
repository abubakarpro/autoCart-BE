import { Module } from '@nestjs/common';
import { AdInteractionService } from './ad-interaction.service';
import { AdInteractionController } from './ad-interaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdInteractionController],
  providers: [AdInteractionService],
})
export class AdInteractionModule {}
