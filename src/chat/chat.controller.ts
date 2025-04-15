import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';

import { ChatService } from './chat.service';

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

  @Delete('message/:messageId')
  deleteMessage(@Param('messageId') messageId: string) {
    return this.chatService.deleteMessage(messageId);
  }

  @Delete('room/:chatRoomId')
  deleteChat(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.deleteChat(chatRoomId);
  }
}
