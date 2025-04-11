import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as moment from 'moment';


@Injectable()
export class DashboardAnalyticsService {
  constructor(private prisma: PrismaService) {}


  async getAdAnalytics(date?: string) {
    const targetDate = date ? moment(date) : moment();
    const start = targetDate.startOf('day').toDate();
    const end = targetDate.endOf('day').toDate();
  
    const totalAds = await this.prisma.ads.count();
  
    const todayAdsCount = await this.prisma.ads.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
  
    const allStatuses = ['NEW', 'USED', 'ACTIVE', 'EXPIRED', 'PENDING', 'REJECTED'] as const;
  
    const statusCounts = await Promise.all(
      allStatuses.map(async (status) => ({
        status,
        count: await this.prisma.ads.count({ where: { status } }),
      }))
    );
  
    return {
      success: true,
      data: {
        totalAds,
        todayAdsCount,
        statusCounts,
      },
      message: 'Ad analytics fetched successfully',
    };
  }
  


  async getUserAnalytics(date?: string) {
    const targetDate = date ? moment(date) : moment();
    const start = targetDate.startOf('day').toDate();
    const end = targetDate.endOf('day').toDate();
  
    const [totalUsers, activeUsers, suspendedUsers, bannedUsers, dailyRegistered, dailyLoggedIn] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { status: 'ACTIVE' } }),
        this.prisma.user.count({ where: { status: 'SUSPENDED' } }),
        this.prisma.user.count({ where: { status: 'BANNED' } }),
  
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: start,
              lte: end,
            },
          },
        }),
  
        this.prisma.user.count({
          where: {
            lastLogin: {
              gte: start,
              lte: end,
            },
          },
        }),
      ]);
  
    return {
      success: true,
      data: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        bannedUsers,
        dailyRegistered,
        dailyLoggedIn,
      },
      message: 'User analytics fetched successfully',
    };
  }
  

  


}
