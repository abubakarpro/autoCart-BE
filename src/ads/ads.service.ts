import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}


  async create(data: CreateAdDto) {
    try {
      const ad = await this.prisma.ads.create({ data });
      return {
        success: true,
        data: ad,
        message: "Ad created successfully",
      };
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      const ads = await this.prisma.ads.findMany();
      return {
        success: true,
        data: ads,
        message: "Ads fetched successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const ads = await this.prisma.user.findUnique({ where: { id } });
      if (!ads) {
        throw new HttpException(`Ad with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: ads,
        message: "Ad fetched successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: CreateAdDto) {
    try {
      const ads = await this.prisma.ads.update({ where: { id }, data });
      return {
        success: true,
        data: ads,
        message: "Ad updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const ads = await this.prisma.ads.delete({ where: { id } });
      return {
        success: true,
        data: ads,
        message: "Ad deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
