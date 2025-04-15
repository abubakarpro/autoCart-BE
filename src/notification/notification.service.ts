import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const Notification = await this.prisma.notification.findMany();
      return {
        success: true,
        data: Notification,
        message: 'Notifications fetched successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findOne(id: string) {
    try {
      const Notification = await this.prisma.notification.findUnique({
        where: { id },
      });
      if (!Notification) {
        throw new NotFoundException(`Notification with id ${id} not found`);
      }
      return {
        success: true,
        data: Notification,
        message: 'Notification fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreateNotificationDto) {
    try {
      const Notification = await this.prisma.notification.create({
        data: {
          type: data.type,
          link: data.link,
          content: data.content,
          userId: data.userId,
          isBroadcast: data.isBroadcast,
          isRead: data.isRead,
        },
      });
      return {
        success: true,
        data: Notification,
        message: 'Notification created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: CreateNotificationDto) {
    try {
      const Notification = await this.prisma.notification.update({
        where: { id },
        data,
      });
      return {
        success: true,
        data: Notification,
        message: 'Notification updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const Notification = await this.prisma.notification.delete({
        where: { id },
      });
      return {
        success: true,
        data: Notification,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
