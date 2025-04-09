import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, UserStatus } from '@prisma/client';
import { GetUser } from '../auth/jwt/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({ status: 200, description: 'List of all Users.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('role') role?: Role,
    @Query('status') status?: UserStatus,
  ) {
    return this.userService.findAll({
      page,
      limit,
      search,
      role,
      status,
    });
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get a User by ID' })
  @ApiResponse({ status: 200, description: 'The User with the given ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a User status by ID' })
  @ApiResponse({
    status: 200,
    description: 'The User status has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
    @GetUser('id') adminId: string,
  ) {
    return this.userService.updateStatus(id, status, adminId);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a User by ID' })
  @ApiResponse({
    status: 200,
    description: 'The User has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(@Param('id') id: string, @GetUser('id') adminId: string) {
    return this.userService.remove(id, adminId);
  }

  @Get('stats/overview')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully.',
  })
  async getUserStats() {
    return this.userService.getUserStats();
  }
}
