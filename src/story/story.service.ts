import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateStoryDto } from './dto/create-story.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../common/user.interface';
import { CreateStoryReportDto } from './dto/create-story-report.dto';

@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStoryDto, user: User) {
    try {
      const story = await this.prisma.story.create({
        data: {
          ...data,
          userId: user.id,
        },
      });
      return {
        success: true,
        data: story,
        message: 'Successfully story created',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const stories = await this.prisma.story.findMany({
        where: {
          deletedAt: null,
        },
      });
      return {
        success: true,
        data: stories,
        message: 'Successfully Story fetched',
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const story = await this.prisma.story.findUnique({
        where: { id, deletedAt: null },
      });
      if (!story) {
        throw new HttpException(
          `Ad with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: story,
        message: 'Story fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: CreateStoryDto) {
    try {
      const story = await this.prisma.story.update({ where: { id }, data });
      return {
        success: true,
        data: story,
        message: 'Story updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const story = await this.prisma.story.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return {
        success: true,
        data: story,
        message: 'Story deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getActiveStories(user: User) {
    const currentTime = new Date();
    const last24Hours = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

    const activeStories = await this.prisma.story.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
        createdAt: {
          gte: last24Hours,
        },
      },
      include: {
        ad: true,
      },
    });
    return {
      success: true,
      data: activeStories,
      message: 'Active Stories fetched successfully',
    };
  }

  async deleteExpiredStories() {
    const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await this.prisma.story.updateMany({
      where: {
        createdAt: {
          lt: expiredDate,
        },
      },
      data: {
        deletedAt: new Date(), // Set the deletion timestamp
      },
    });
  }

  async viewStory(storyId: string, userId: string) {
    const existingView = await this.prisma.storyView.findUnique({
      where: { userId_storyId: { userId, storyId } },
    });

    if (existingView) {
      return {
        success: true,
        data: '',
        message: 'Story already viewed by the user.',
      };
    }

    // Record the new view
    await this.prisma.storyView.create({
      data: {
        userId,
        storyId,
      },
    });

    return {
      success: true,
      data: '',
      message: 'Story viewed successfully.',
    };
  }

  async getStoryViews(storyId: string) {
    try {
      const totalViews = await this.prisma.storyView.count({
        where: { storyId },
      });

      return {
        success: true,
        data: totalViews,
        message: 'Story viewed successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async getViewedStoriesByUser(userId: string) {
    try {
      const viewedStories = await this.prisma.storyView.findMany({
        where: { userId },
        include: {
          story: true,
        },
      });

      const stories = viewedStories.map((view) => view.story);

      return {
        success: true,
        data: stories,
        message: 'Successfully fetched viewed stories',
      };
    } catch (error) {
      throw error;
    }
  }

  async getStoriesOfFollowingUsers(userId: string) {
    try {
      const followingUsers = await this.prisma.follower.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingUserIds = followingUsers.map(
        (follow) => follow.followingId,
      );

      const stories = await this.prisma.story.findMany({
        where: {
          userId: { in: followingUserIds },
        },
      });

      return {
        success: true,
        data: stories,
        message: 'Successfully fetched stories of following users',
      };
    } catch (error) {
      throw error;
    }
  }

  async getTrendingStories() {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const trendingStories = await this.prisma.story.findMany({
        where: {
          views: {
            some: {
              createdAt: { gte: oneDayAgo },
            },
          },
          deletedAt: null,
        },
        include: {
          views: true,
          user: true,
        },
        orderBy: {
          views: { _count: 'desc' },
        },
        // take: 10,
      });

      return {
        success: true,
        data: trendingStories,
        message: 'Successfully fetched trending stories',
      };
    } catch (error) {
      throw error;
    }
  }

  async reportStory(user: User, dto: CreateStoryReportDto) {
    try {
      const story = await this.prisma.story.findUnique({
        where: { id: dto.storyId, deletedAt: null },
      });

      if (!story) {
        return {
          success: false,
          data: null,
          message: 'Story not found.',
        };
      }

      const existingReport = await this.prisma.storyReport.findUnique({
        where: {
          storyId_reportedById: {
            storyId: dto.storyId,
            reportedById: user.id,
          },
        },
      });

      if (existingReport) {
        return {
          success: false,
          data: null,
          message: 'You have already reported this story.',
        };
      }

      const report = await this.prisma.storyReport.create({
        data: {
          storyId: dto.storyId,
          reportedById: user.id,
          ReportCategory: dto.reportCategory,
          reason: dto.reason,
        },
      });

      return {
        success: true,
        data: report,
        message: 'Story reported successfully.',
      };
    } catch (error) {
      throw error;
    }
  }
}
