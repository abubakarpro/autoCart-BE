import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardAnalyticsService } from './dashboard-analytics.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Dashboard Analytics')
@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
@Controller('dashboard-analytics')
export class DashboardAnalyticsController {
  constructor(private readonly dashboardAnalyticsService: DashboardAnalyticsService) {}

  @Get('ads')
  @Roles(Role.SUPER_ADMIN)
  getAdAnalytics() {
    return this.dashboardAnalyticsService.getAdAnalytics();
  }

  @Get('users')
  @Roles(Role.SUPER_ADMIN)
  getUserAnalytics() {
    return this.dashboardAnalyticsService.getUserAnalytics();
  }

}
