import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody('chatRoomId') chatRoomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(chatRoomId);
    console.log(`User joined room: ${chatRoomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    messageData: {
      chatRoomId: string;
      senderId: string;
      receiverId: string;
      content: string;
      fileUrls?: string[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.sendMessage(
      messageData.chatRoomId,
      messageData.senderId,
      messageData.receiverId,
      messageData.content,
      messageData.fileUrls,
    );
    this.server.to(messageData.chatRoomId).emit('receiveMessage', message);
  }
}
