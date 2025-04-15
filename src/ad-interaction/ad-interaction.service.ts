import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdInteractionService {
  constructor(private prisma: PrismaService) {}

  async likeAd(userId: string, adId: string) {
    try {
      const like = await this.prisma.adInteraction.create({
        data: {
          userId,
          adId,
          type: 'LIKE',
        },
        include: {
          ad: true,
        },
      });
      return {
        success: true,
        data: like,
        message: 'Ad liked successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async viewAd(adId: string) {
    try {
      const view = await this.prisma.adInteraction.create({
        data: {
          adId,
          type: 'VIEW',
        },
        include: {
          ad: true,
        },
      });
      return {
        success: true,
        data: view,
        message: 'Ad viewed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async shareAd(adId: string) {
    try {
      const share = await this.prisma.adInteraction.create({
        data: {
          adId,
          type: 'SHARE',
        },
        include: {
          ad: true,
        },
      });
      return {
        success: true,
        data: share,
        message: 'Ad shared successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdLikes(adId: string) {
    try {
      const count = await this.prisma.adInteraction.count({
        where: {
          adId,
          type: 'LIKE',
        },
      });
      return {
        success: true,
        data: count,
        message: 'Ad likes fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdViews(adId: string) {
    try {
      const count = await this.prisma.adInteraction.count({
        where: {
          adId,
          type: 'VIEW',
        },
      });
      return {
        success: true,
        data: count,
        message: 'Ad views fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdShares(adId: string) {
    try {
      const count = await this.prisma.adInteraction.count({
        where: {
          adId,
          type: 'SHARE',
        },
      });
      return {
        success: true,
        data: count,
        message: 'Ad shares fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async unlikeAllAds(userId: string) {
    try {
      const deletedLikes = await this.prisma.adInteraction.deleteMany({
        where: {
          userId,
          type: 'LIKE',
        },
      });

      return {
        success: true,
        data: deletedLikes,
        message: 'All ads unliked successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async likeAllAds(userId: string) {
    try {
      const ads = await this.prisma.ads.findMany({
        select: { id: true },
      });

      const likePromises = ads.map((ad) =>
        this.prisma.adInteraction.create({
          data: {
            userId,
            adId: ad.id,
            type: 'LIKE',
          },
        }),
      );

      const likes = await Promise.all(likePromises);

      return {
        success: true,
        data: likes,
        message: 'All ads liked successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
