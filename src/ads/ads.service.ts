import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateAdDto } from './dto/create-ad.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StoryService } from '../story/story.service';
import { User } from '../common/user.interface';
import { AdQueryDto } from './dto/ads-query.dto';
import { CreateAdReportDto } from './dto/create-ad-report.dto';

@Injectable()
export class AdsService {
  constructor(
    private prisma: PrismaService,
    private storyService: StoryService,
  ) {}

  async create(data: CreateAdDto, user: User) {
    try {
      const ad = await this.prisma.ads.create({
        data: {
          ...data,
          userId: user.id,
        },
      });

      if (data?.uploadImagesForStory && data.uploadImagesForStory.length > 0) {
        const dataForStory = {
          uploadImagesForStory: data.uploadImagesForStory,
          adId: ad.id,
        };
        await this.storyService.create(dataForStory, user);
      }
      return {
        success: true,
        data: ad,
        message: 'Ad created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(query?: AdQueryDto, user?: User) {
    try {
      const whereCondition: any = {};
  
      // User-specific filters
      if (user && user.role !== 'SUPER_ADMIN') {
        whereCondition.userId = user.id;
      }
  
      // Static filters
      if (query?.status) {
        whereCondition.status = query.status;
      }
  
      if (query?.itemName) {
        whereCondition.itemName = {
          contains: query.itemName,
          mode: 'insensitive',
        };
      }
  
      if (query?.location) {
        whereCondition.location = {
          contains: query.location,
          mode: 'insensitive',
        };
      }
  
      if (query?.countryOfRegistration) {
        whereCondition.countryOfRegistration = {
          contains: query.countryOfRegistration,
          mode: 'insensitive',
        };
      }
  
      if (query?.categoryId) {
        whereCondition.categoryId = query.categoryId;
      }
  
      const currentYear = new Date().getFullYear();
  
      if (query.minYear || query.maxYear) {
        const minYear = query.minYear ?? 1900;
        const maxYear = query.maxYear ?? currentYear;
        if (maxYear > currentYear) {
          throw new Error('Future year is not allowed');
        }
        whereCondition.yearOfProduction = {
          gte: minYear,
          lte: maxYear,
        };
      }
  
      if (query.minPrice || query.maxPrice) {
        whereCondition.price = {
          gte: query.minPrice ?? 0,
          lte: query.maxPrice ?? Number.MAX_SAFE_INTEGER,
        };
      }
  
      if (query.minMileage || query.maxMileage) {
        whereCondition.mileage = {
          gte: query.minMileage ?? 0,
          lte: query.maxMileage ?? Number.MAX_SAFE_INTEGER,
        };
      }
  
      // Fetch ads
      const ads = await this.prisma.ads.findMany({
        where: whereCondition,
        include: {
          user: true,
          _count: {
            select: {
              AdInteraction: true,
            },
          },
        },
      });
  
      const formattedAds = await Promise.all(
        ads.map(async (ad) => {
          const [likes, views, shares] = await Promise.all([
            this.prisma.adInteraction.count({ where: { adId: ad.id, type: 'LIKE' } }),
            this.prisma.adInteraction.count({ where: { adId: ad.id, type: 'VIEW' } }),
            this.prisma.adInteraction.count({ where: { adId: ad.id, type: 'SHARE' } }),
          ]);
  
          return { ...ad, likes, views, shares };
        })
      );
  
      return {
        success: true,
        data: formattedAds,
        message: 'Ads fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }
  

  async findOne(id: string) {
    try {
      // Fetch the ad details with associated user data
      const ad = await this.prisma.ads.findUnique({
        where: { id },
        include: { user: true },
      });
  
      if (!ad) {
        throw new HttpException(
          `Ad with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
  
      const [likes, views, shares] = await Promise.all([
        this.prisma.adInteraction.count({ where: { adId: id, type: 'LIKE' } }),
        this.prisma.adInteraction.count({ where: { adId: id, type: 'VIEW' } }),
        this.prisma.adInteraction.count({ where: { adId: id, type: 'SHARE' } }),
      ]);
  
      return {
        success: true,
        data: { 
          ...ad,
          likes,
          views,
          shares
        },
        message: 'Ad fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: CreateAdDto) {
    try {
      const ads = await this.prisma.ads.update({ where: { id }, data });
      return {
        success: true,
        data: ads,
        message: 'Ad updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const ads = await this.prisma.ads.delete({ where: { id } });
      return {
        success: true,
        data: ads,
        message: 'Ad deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async reportAd(dto: CreateAdReportDto, user:User) {
    try {
      const { adId, reason } = dto;
  
      const existing = await this.prisma.adReport.findFirst({
        where: {
          adId,
          reportedById: user.id,
        },
      });
  
      if (existing) {
        throw new HttpException(
          'You have already reported this ad.',
          HttpStatus.BAD_REQUEST,
        );
      }
  
      const report = await this.prisma.adReport.create({
        data: {
          adId,
          reportedById:user.id,
          reason,
        },
      });
  
      return {
        success: true,
        data: report,
        message: 'Ad reported successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
