import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createRoom(userId: string, otherUserId: string) {
    try {
      let chatRoom = await this.prisma.chatRoom.findFirst({
        where: {
          participants: {
            some: { userId },
          },
        },
        include: { participants: true },
      });

      if (!chatRoom) {
        chatRoom = await this.prisma.chatRoom.create({
          data: {
            participants: {
              create: [
                { user: { connect: { id: userId } } },
                { user: { connect: { id: otherUserId } } },
              ],
            },
          },
          include: { participants: true },
        });
      }
      return {
        success: true,
        message: 'Successfully Room created.',
        data: chatRoom,
      };
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(
    chatRoomId: string,
    senderId: string,
    receiverId: string,
    content: string,
    fileUrls?: string[],
  ) {
    try {
      const message = await this.prisma.message.create({
        data: {
          chatRoom: { connect: { id: chatRoomId } },
          sender: { connect: { id: senderId } },
          receiver: { connect: { id: receiverId } }, // 👈 added
          content,
          fileUrls,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
        },
      });
  
      return {
        success: true,
        message: 'Successfully sent Message.',
        data: message,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMessages(chatRoomId: string) {
    try {
      const messages = await this.prisma.message.findMany({
        where: { chatRoomId, deletedAt: null },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
        },
      });
  
      return {
        success: true,
        message: 'Successfully fetched Messages.',
        data: messages,
      };
    } catch (error) {
      throw error;
    }
  }
  
  

  async deleteMessage(messageId: string) {
    try {
      const message = await this.prisma.message.update({
        where: { id: messageId },
        data: { deletedAt: new Date() },
      });
  
      return {
        success: true,
        message: 'Message deleted successfully.',
        data: message,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteChat(chatRoomId: string) {
    try {
      const chatRoom = await this.prisma.chatRoom.update({
        where: { id: chatRoomId },
        data: { deletedAt: new Date() },
      });
  
      await this.prisma.message.updateMany({
        where: { chatRoomId },
        data: { deletedAt: new Date() },
      });
  
      return {
        success: true,
        message: 'Chat deleted successfully.',
        data: chatRoom,
      };
    } catch (error) {
      throw error;
    }
  }

  async reportMessage(messageId: string, userId: string, reason?: string) {
    try {
      const existingReport = await this.prisma.messageReport.findUnique({
        where: { messageId_userId: { messageId, userId } },
      });

      if (existingReport) {
        return {
          success: false,
          message: 'This message has already been reported by the user.',
        };
      }

      const report = await this.prisma.messageReport.create({
        data: {
          messageId,
          userId,
          reason,
        },
      });

      return {
        success: true,
        message: 'Message reported successfully.',
        data: report,
      };
    } catch (error) {
      throw error;
    }
  }

  async getReportedMessages() {
    try {
      const reportedMessages = await this.prisma.messageReport.findMany({
        include: {
          message: {
            include: {
              sender: true, 
            },
          },
          user: true, 
        },
      });

      return {
        success: true,
        message: 'Reported messages retrieved successfully.',
        data: reportedMessages,
      };
    } catch (error) {
      throw error;
    }
  }
}
