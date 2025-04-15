import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';

import { AdInteractionService } from './ad-interaction.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { GetUser } from "../auth/jwt/get-user.decorator";
import { User } from '../common/user.interface';

@Controller('ad-interaction')
export class AdInteractionController {
  constructor(private readonly adInteractionService: AdInteractionService) {}

  @Post('like-all')
  @UseGuards(JwtGuard)
  async likeAllAds(@GetUser() user: User) {
    return this.adInteractionService.likeAllAds(user.id);
  }

  // ✅ Unlike All Ads
  @Post('unlike-all')
  @UseGuards(JwtGuard)
  async unlikeAllAds(@GetUser() user: User) {
    return this.adInteractionService.unlikeAllAds(user.id);
  }


  @Get(':adId/like')
  @UseGuards(JwtGuard)
  async likeAd(@Param('adId') adId: string, @GetUser() user: User) {
    return this.adInteractionService.likeAd(user.id, adId);
  }

  @Get(':adId/view')
  async viewAd(@Param('adId') adId: string) {
    return this.adInteractionService.viewAd(adId);
  }

  @Get(':adId/share')
  async shareAd(@Param('adId') adId: string) {
    return this.adInteractionService.shareAd(adId);
  }

  @Get(':adId/likes')
  async getAdLikes(@Param('adId') adId: string) {
    return this.adInteractionService.getAdLikes(adId);
  }

  @Get(':adId/views')
  async getAdViews(@Param('adId') adId: string) {
    return this.adInteractionService.getAdViews(adId);
  }

  @Get(':adId/shares')
  async getAdShares(@Param('adId') adId: string) {
    return this.adInteractionService.getAdShares(adId);
  }
}
