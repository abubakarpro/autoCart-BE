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

    return this.prisma.story.findMany({
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
    console.log('Expired stories deleted successfully.');
  }
}
