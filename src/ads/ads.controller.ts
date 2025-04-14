import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JwtGuard } from "../auth/jwt/jwt.guard";
import { GetUser } from "../auth/jwt/get-user.decorator";
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { User } from '../common/user.interface';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionjwt.guard';
import { AdQueryDto } from './dto/ads-query.dto';
import { AdStatus } from '@prisma/client';
import { ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAdReportDto } from './dto/create-ad-report.dto';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createAdDto: CreateAdDto, @GetUser() user:User) {
    return this.adsService.create(createAdDto, user);
  }

  @UseGuards(JwtGuard)
  @Post('report')
  async reportAd(@Body() dto: CreateAdReportDto, @GetUser() user:User) {
    return this.adsService.reportAd(dto, user);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiQuery({
    name: 'status',
    required: false,
    enum: AdStatus,
    description: 'Filter ads by status (e.g., PENDING, REJECTED, APPROVED)',
  })
  @ApiQuery({
    name: 'itemName',
    required: false,
    type: String,
    description: 'Search ads by item name',
  })
  findAll(@Query() query: AdQueryDto, @GetUser() user?:User) {
    return this.adsService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateAdDto: CreateAdDto) {
    return this.adsService.update(id, updateAdDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.adsService.remove(id);
  }
}
