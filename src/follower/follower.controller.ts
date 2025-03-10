import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';

@Controller('follower')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post(':followerId/follow/:followingId')
  follow(@Param('followerId') followerId: string, @Param('followingId') followingId: string) {
    return this.followerService.followUser(followerId, followingId);
  }

  @Delete(':followerId/unfollow/:followingId')
  unfollow(@Param('followerId') followerId: string, @Param('followingId') followingId: string) {
    return this.followerService.unfollowUser(followerId, followingId);
  }

  @Get(':userId/followers')
  getFollowers(@Param('userId') userId: string) {
    return this.followerService.getFollowers(userId);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId') userId: string) {
    return this.followerService.getFollowing(userId);
  }
}
