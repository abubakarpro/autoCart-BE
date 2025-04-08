import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtGuard } from "../auth/jwt/jwt.guard";
import { GetUser } from "../auth/jwt/get-user.decorator";
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { User } from '../common/user.interface';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionjwt.guard';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createAdDto: CreateAdDto, @GetUser() user:User) {
    return this.adsService.create(createAdDto, user);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@GetUser() user?:User) {
    console.log("user", user)
    return this.adsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() updateAdDto: CreateAdDto) {
    return this.adsService.update(id, updateAdDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    return this.adsService.remove(id);
  }
}
