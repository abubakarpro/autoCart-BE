import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({ data });
      return {
        success: true,
        data: category,
        message: 'Successfully Category created',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany();
      return {
        success: true,
        data: categories,
        message: 'Successfully Category fetched',
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({ where: { id } });
      if (!category) {
        throw new HttpException(
          `Ad with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: category,
        message: 'Category fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data,
      });
      return {
        success: true,
        data: category,
        message: 'Category updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const category = await this.prisma.category.delete({ where: { id } });
      return {
        success: true,
        data: category,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
