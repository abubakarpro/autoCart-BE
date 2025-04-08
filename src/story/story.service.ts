import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/common/user.interface';

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
        message: "Successfully story created",
      };
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      const stories = await this.prisma.story.findMany();
      return {
        success: true,
        data: stories,
        message: "Successfully Story fetched",
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const story = await this.prisma.story.findUnique({ where: { id } });
      if (!story) {
        throw new HttpException(`Ad with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: story,
        message: "Story fetched successfully",
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
        message: "Story updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const story = await this.prisma.story.delete({ where: { id } });
      return {
        success: true,
        data: story,
        message: "Category deleted successfully",
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
      message: "Active Stories fetched successfully",
    };
  }

  async deleteExpiredStories() {
    const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await this.prisma.story.deleteMany({
      where: {
        createdAt: {
          lt: expiredDate,
        },
      },
    });
  }

  async viewStory(storyId: string, userId: string) {
    // Check if the user has already viewed the story
    const existingView = await this.prisma.storyView.findUnique({
      where: { userId_storyId: { userId, storyId } },
    });

    if (existingView) {
      return {
        success: true,
        data: "",
        message: "Story already viewed by the user.",
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
      data: "",
      message: 'Story viewed successfully.' 
    };
  }

  async getStoryViews(storyId: string) {
    // Count total views for a specific story
    try{
      const totalViews = await this.prisma.storyView.count({
        where: { storyId },
      });

      return { 
        success: true,
        data: totalViews,
        message: 'Story viewed successfully.' 
      };
  
    }catch(error){
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
  
      const stories = viewedStories.map(view => view.story);
  
      return {
        success: true,
        data: stories,
        message: "Successfully fetched viewed stories",
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Get all stories of users the specific user is following
  async getStoriesOfFollowingUsers(userId: string) {
    try {
      const followingUsers = await this.prisma.follower.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
  
      const followingUserIds = followingUsers.map(follow => follow.followingId);
  
      const stories = await this.prisma.story.findMany({
        where: {
          userId: { in: followingUserIds },
        },
      });
  
      return {
        success: true,
        data: stories,
        message: "Successfully fetched stories of following users",
      };
    } catch (error) {
      throw error;
    }
  }

  //trending Stories
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
        },
        include: {
          views: true,
          user: true,
        },
        orderBy: {
          views: { _count: 'desc' },
        },
        take: 10,
      });
  
      return {
        success: true,
        data: trendingStories,
        message: "Successfully fetched trending stories",
      };
    } catch (error) {
      throw error;
    }
  }

}
