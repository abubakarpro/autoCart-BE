
import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const User = await this.prisma.user.findMany();
      return {
        success: true,
        data: User,
        message: "Users fetched successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const User = await this.prisma.user.findUnique({ where: { id } });
      if (!User) {
        throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: User,
        message: "User fetched successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreateUserDto) {
    try {
      const User = await this.prisma.user.create({ data });
      return {
        success: true,
        data: User,
        message: "User created successfully",
      };
    } catch (error) {
      throw error
    }
  }

  async update(id: string, data: CreateUserDto) {
    try {
      const User = await this.prisma.user.update({ where: { id }, data });
      return {
        success: true,
        data: User,
        message: "User updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const User = await this.prisma.user.delete({ where: { id } });
      return {
        success: true,
        data: User,
        message: "User deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
