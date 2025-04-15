import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowerService {
  constructor(private prisma: PrismaService) {}

  async followUser(followerId: string, followingId: string) {
    try {
      if (followerId === followingId) throw new Error('Cannot follow yourself');
      const result = await this.prisma.follower.create({
        data: {
          followerId,
          followingId,
        },
      });
      return {
        success: true,
        message: 'Successfully followed the user.',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async unfollowUser(followerId: string, followingId: string) {
    try {
      const unfollow = await this.prisma.follower.deleteMany({
        where: { followerId, followingId },
      });
      return {
        success: true,
        message: 'Successfully unfollowed the user.',
        data: unfollow,
      };
    } catch (error) {
      throw error;
    }
  }

  async getFollowers(userId: string) {
    try {
      const followers = await this.prisma.follower.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              email: true,
              address: true,
              profileImage: true,
              phoneNumber: true,
            },
          },
        },
      });
      return {
        success: true,
        message: 'Successfully retrieved the list of followers for the user.',
        data: followers,
      };
    } catch (error) {}
  }

  async getFollowing(userId: string) {
    try {
      const followingUser = await this.prisma.follower.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              email: true,
              address: true,
              profileImage: true,
              phoneNumber: true,
            },
          },
        },
      });

      return {
        success: true,
        message:
          'Successfully retrieved the list of users the user is following.',
        data: followingUser,
      };
    } catch (error) {
      throw error;
    }
  }
}
