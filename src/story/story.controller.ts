import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { GetUser } from '../auth/jwt/get-user.decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { User } from '../common/user.interface';
import { CreateStoryReportDto } from './dto/create-story-report.dto';

@Controller('story')
@UseGuards(JwtGuard)
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post('report')
  async reportStory(@Body() dto: CreateStoryReportDto, @GetUser() user: User) {
    return this.storyService.reportStory(user, dto);
  }

  @Post(':storyId/view')
  async viewStory(@Param('storyId') storyId: string, @GetUser() user: User) {
    return this.storyService.viewStory(storyId, user.id);
  }

  @Post()
  create(@Body() createStoryDto: CreateStoryDto, @GetUser() user: User) {
    return this.storyService.create(createStoryDto, user);
  }

  @Get('viewed-stories')
  async getViewedStories(@GetUser() user: User) {
    return this.storyService.getViewedStoriesByUser(user.id);
  }

  @Get('following-stories')
  async getFollowingStories(@GetUser() user: User) {
    return this.storyService.getStoriesOfFollowingUsers(user.id);
  }

  @Get(':storyId/views-count')
  async getStoryViews(@Param('storyId') storyId: string) {
    return this.storyService.getStoryViews(storyId);
  }

  @Get('active')
  getActiveStories(@GetUser() user: User) {
    return this.storyService.getActiveStories(user);
  }

  @Get('trending')
  async getTrendingStories() {
    return this.storyService.getTrendingStories();
  }

  @Get()
  findAll() {
    return this.storyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoryDto: CreateStoryDto) {
    return this.storyService.update(id, updateStoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storyService.remove(id);
  }

  //Deleting Stories
  @Cron('0 * * * *') // Runs every hour
  async deleteExpiredStories() {
    await this.storyService.deleteExpiredStories();
  }
}
