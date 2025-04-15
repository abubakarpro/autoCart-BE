import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role, UserStatus, Prisma } from '@prisma/client';
import { CreateUserReportDto } from './dto/create-user-report.dto';
import { User } from '../common/user.interface';

interface FindAllUsersParams {
  page: number;
  limit: number;
  search?: string;
  role?: Role;
  status?: UserStatus;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll({ page, limit, search, role, status }: FindAllUsersParams) {
    try {
      const skip = (page - 1) * limit;

      const where: Prisma.UserWhereInput = {
        AND: [
          search
            ? {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    email: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    phoneNumber: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              }
            : {},
          role ? { role } : {},
          status ? { status } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      };

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        success: true,
        message: 'Successfully fetched all users.',
        data: {
          users: users,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const User = await this.prisma.user.findUnique({ where: { id } });
      if (!User) {
        throw new HttpException(
          `User with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: User,
        message: 'User fetched successfully',
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
        message: 'User created successfully',
        data: User,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: CreateUserDto) {
    try {
      const User = await this.prisma.user.update({ where: { id }, data });
      return {
        success: true,
        message: 'User updated successfully',
        data: User,
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
        message: 'User deleted successfully',
        data: User,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: string, status: UserStatus, adminId: string) {
    try {
      const admin = await this.prisma.user.findUnique({
        where: { id: adminId },
      });

      if (!admin || admin.role !== Role.SUPER_ADMIN) {
        throw new HttpException(
          'Unauthorized to perform this action',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Prevent admin from changing their own status
      if (user.id === adminId) {
        throw new HttpException(
          'Cannot change your own status',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { status },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          phoneNumber: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, adminId: string) {
    try {
      const admin = await this.prisma.user.findUnique({
        where: { id: adminId },
      });

      if (!admin || admin.role !== Role.SUPER_ADMIN) {
        throw new HttpException(
          'Unauthorized to perform this action',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Prevent admin from deleting themselves
      if (user.id === adminId) {
        throw new HttpException(
          'Cannot delete your own account',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.prisma.user.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'User deleted successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserStats() {
    try {
      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        bannedUsers,
        privateSellers,
        traderSellers,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
        this.prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
        this.prisma.user.count({ where: { status: UserStatus.BANNED } }),
        this.prisma.user.count({ where: { role: Role.PRIVATE_SELLER } }),
        this.prisma.user.count({ where: { role: Role.TRADER_SELLER } }),
      ]);

      const stats = {
        totalUsers,
        activeUsers,
        suspendedUsers,
        bannedUsers,
        privateSellers,
        traderSellers,
        activePercentage: (activeUsers / totalUsers) * 100,
      };

      return {
        success: true,
        message: 'User stats fetched successfully',
        data: stats,
      };
    } catch (error) {
      throw error;
    }
  }

  async reportUser(dto: CreateUserReportDto, user: User) {
    try {
      const { reportedUserId, reason } = dto;

      if (reportedUserId === user.id) {
        throw new HttpException(
          'You cannot report yourself',
          HttpStatus.BAD_REQUEST,
        );
      }

      const existing = await this.prisma.userReport.findFirst({
        where: {
          reportedUserId,
          reportedById: user.id,
        },
      });

      if (existing) {
        throw new HttpException(
          'You have already reported this user.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const report = await this.prisma.userReport.create({
        data: {
          reportedUserId,
          reportedById: user.id,
          reason,
        },
      });

      return {
        success: true,
        data: report,
        message: 'User reported successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
