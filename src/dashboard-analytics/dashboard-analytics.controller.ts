import {
  Controller,
  Get,
  UseGuards,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { DashboardAnalyticsService } from './dashboard-analytics.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Dashboard Analytics')
@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
@Controller('dashboard-analytics')
export class DashboardAnalyticsController {
  constructor(
    private readonly dashboardAnalyticsService: DashboardAnalyticsService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Get('reported-users')
  async getAllReportedUsers(@Query('isRead') isRead?: string) {
    const parsedIsRead =
      isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.dashboardAnalyticsService.getAllReportedUsers(parsedIsRead);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get('reported-ads')
  async getAllReportedAds(@Query('isRead') isRead?: string) {
    const parsedIsRead =
      isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.dashboardAnalyticsService.getAllReportedAds(parsedIsRead);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get('reported-stories')
  async getAllReportedStories(@Query('isRead') isRead?: string) {
    const parsedIsRead =
      isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.dashboardAnalyticsService.getAllReportedStories(parsedIsRead);
  }

  @Get('ads')
  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Date in YYYY-MM-DD format (optional)',
  })
  getAdAnalytics(@Query('date') date?: string) {
    return this.dashboardAnalyticsService.getAdAnalytics();
  }

  @Get('users')
  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Date in YYYY-MM-DD format (optional)',
  })
  getUserAnalytics(@Query('date') date?: string) {
    return this.dashboardAnalyticsService.getUserAnalytics();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Get('reported-messages')
  async getReportedMessages(@Query('timeFrame') timeFrame: string) {
    return this.dashboardAnalyticsService.getReportedMessages(timeFrame);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Get('reported-messages-counts')
  async getReportedMessagesCounts() {
    return await this.dashboardAnalyticsService.getAllReportedMessagesCount();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Get('story-stats')
  async getStoryStats() {
    return await this.dashboardAnalyticsService.getStoryStats();
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch('reported-users/:id/read')
  async markUserReportAsRead(@Param('id') id: string) {
    return this.dashboardAnalyticsService.markUserReportAsRead(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch('reported-ads/:id/read')
  async markAdReportAsRead(@Param('id') id: string) {
    return this.dashboardAnalyticsService.markAdReportAsRead(id);
  }
}
