import { Injectable } from '@nestjs/common';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowerService {
  constructor(private prisma: PrismaService) {}

  async followUser(followerId: string, followingId: string) {
    try {
      if (followerId === followingId) throw new Error('Cannot follow yourself');
      return this.prisma.follower.create({
        data: {
          followerId,
          followingId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async unfollowUser(followerId: string, followingId: string) {
    return this.prisma.follower.deleteMany({
      where: { followerId, followingId },
    });
  }

  async getFollowers(userId: string) {
    return this.prisma.follower.findMany({
      where: { followingId: userId },
      include: { follower: true },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follower.findMany({
      where: { followerId: userId },
      include: { following: true },
    });
  }
}
