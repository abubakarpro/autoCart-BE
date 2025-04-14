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

  async getAllReportedUsers(isRead?: boolean) {
    try {
      const reports = await this.prisma.userReport.findMany({
        where: isRead !== undefined ? { isRead } : undefined,
        include: {
          reportedUser: true,
          reportedBy: true,
        },
      });
  
      return {
        success: true,
        data: reports,
        message: 'All reported users fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllReportedAds(isRead?: boolean) {
    try {
      const reports = await this.prisma.adReport.findMany({
        where: isRead !== undefined ? { isRead } : undefined,
        include: {
          ad: true,
          reportedBy: true,
        },
      });
  
      return {
        success: true,
        data: reports,
        message: 'All reported ads fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async markUserReportAsRead(id: string) {
    try {
      const report = await this.prisma.userReport.update({
        where: { id },
        data: { isRead: true },
      });
  
      return {
        success: true,
        data: report,
        message: 'User report marked as read successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async markAdReportAsRead(id: string) {
    try {
      const report = await this.prisma.adReport.update({
        where: { id },
        data: { isRead: true },
      });
  
      return {
        success: true,
        data: report,
        message: 'Ad report marked as read successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getReportedMessages(timeFrame: string) {
    try {
      const reportedMessages = await this.prisma.messageReport.findMany({
        include: {
          message: {
            include: {
              sender: true, 
            },
          },
          user: true, 
        },
      });

      return {
        success: true,
        message: 'Reported messages retrieved successfully.',
        data: reportedMessages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllReportedMessagesCount() {
    try {
      const now = new Date();
  
      const counts = {
        today: await this.getReportedMessagesCount(new Date(now.setHours(0, 0, 0, 0))),
        weekly: await this.getReportedMessagesCount(this.getStartOfWeek(now)),
        monthly: await this.getReportedMessagesCount(new Date(now.getFullYear(), now.getMonth(), 1)),
        yearly: await this.getReportedMessagesCount(new Date(now.getFullYear(), 0, 1)),
      };
  
      return {
        success: true,
        message: 'Reported messages counts retrieved successfully.',
        data: counts,
      };
    } catch (error) {
      throw error;
    }
  }

  async getReportedMessagesCount(startDate: Date) {
    try {
      const reportedMessagesCount = await this.prisma.messageReport.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      });
  
      return reportedMessagesCount;
    } catch (error) {
      throw error;
    }
  }

  getStartOfWeek(date: Date): Date {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Set to Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Start of the day
    return startOfWeek;
  }

}
