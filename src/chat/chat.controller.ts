import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post('send')
  sendMessage(@Body() body: {
    senderId: string; receiverId: string; text: string; mediaUrl?: string
  }) {
    return this.chatService.sendMessage(
      body.senderId, body.receiverId, body.text, body.mediaUrl
    );
  }

  @Get('messages/:user1/:user2')
  getMessages(@Param('user1') user1: string, @Param('user2') user2: string) {
    return this.chatService.getMessages(user1, user2);
  }

  @Post('mark-read')
  markAsRead(@Body() body: {
    userId: string; otherUserId: string
  }) {
    return this.chatService.markAsRead(
      body.userId, body.otherUserId
    );
  }

  @Get('conversations/:userId')
  getConversations(@Param('userId') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get('users')
  getUsers(@Query('currentUserId') currentUserId?: string, @Query('search') search?: string) {
    return this.chatService.getChatUsers(currentUserId, search);
  }
}