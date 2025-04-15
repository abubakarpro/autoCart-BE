import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { FollowerService } from './follower.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('follower')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post(':followerId/follow/:followingId')
  @UseGuards(JwtGuard)
  follow(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.followerService.followUser(followerId, followingId);
  }

  @Delete(':followerId/unfollow/:followingId')
  @UseGuards(JwtGuard)
  unfollow(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.followerService.unfollowUser(followerId, followingId);
  }

  @Get(':userId/followers')
  @UseGuards(JwtGuard)
  getFollowers(@Param('userId') userId: string) {
    return this.followerService.getFollowers(userId);
  }

  @Get(':userId/following')
  @UseGuards(JwtGuard)
  getFollowing(@Param('userId') userId: string) {
    return this.followerService.getFollowing(userId);
  }
}
