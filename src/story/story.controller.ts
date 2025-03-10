import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { GetUser } from "../auth/jwt/get-user.decorator";
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { User } from 'src/common/user.interface';
import { Cron } from '@nestjs/schedule';

@Controller('story')
@UseGuards(JwtGuard)
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  create(@Body() createStoryDto: CreateStoryDto, @GetUser() user: User) {
    return this.storyService.create(createStoryDto, user);
  }

  @Get('active')
  getActiveStories(@GetUser() user: User) {
    return this.storyService.getActiveStories(user);
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
