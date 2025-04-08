import { Module } from '@nestjs/common';
import { DashboardAnalyticsService } from './dashboard-analytics.service';
import { DashboardAnalyticsController } from './dashboard-analytics.controller';
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [DashboardAnalyticsController],
  providers: [DashboardAnalyticsService],
})
export class DashboardAnalyticsModule {}
