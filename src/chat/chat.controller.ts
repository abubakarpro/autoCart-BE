import { Controller, Post, Body, Get, Param, Delete, Patch , UseGuards} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiBearerAuth,
} from '@nestjs/swagger';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create-room')
  createRoom(@Body() data: { userId: string; otherUserId: string }) {
    return this.chatService.createRoom(data.userId, data.otherUserId);
  }

  @Get(':chatRoomId/messages')
  getMessages(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.getMessages(chatRoomId);
  }

  @Post('report-message')
  async reportMessage(
    @Body() data: { messageId: string; userId: string; reason?: string },
  ) {
    return this.chatService.reportMessage(data.messageId, data.userId, data.reason);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @Get('reported-messages')
  async getReportedMessages() {
    return this.chatService.getReportedMessages();
  }

  @Delete('message/:messageId')
  deleteMessage(@Param('messageId') messageId: string) {
    return this.chatService.deleteMessage(messageId);
  }

  @Delete('room/:chatRoomId')
  deleteChat(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.deleteChat(chatRoomId);
  }
}
