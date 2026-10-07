import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track connected sockets per user: userId -> Set of socketIds
  private userSockets = new Map<string, Set<string>>();
  // Track socket to user: socketId -> userId
  private socketUsers = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    // Connection established
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      this.socketUsers.delete(client.id);
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
          // Broadcast that user is offline
          this.server.emit('user_status', { userId, isOnline: false });
        }
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    const userId = data?.userId;
    if (!userId) return;

    client.join(`user_${userId}`);
    this.socketUsers.set(client.id, userId);

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(client.id);

    // Broadcast that this user is online
    this.server.emit('user_status', { userId, isOnline: true });

    // Send currently online user IDs to the joining client
    const onlineUserIds = Array.from(this.userSockets.keys());
    client.emit('online_users', onlineUserIds);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      text: string;
      mediaUrl?: string;
    },
  ) {
    const { senderId, receiverId, text, mediaUrl } = data;
    if (!senderId || !receiverId || !text?.trim()) return;

    try {
      const savedMessage = await this.chatService.sendMessage(
        senderId,
        receiverId,
        text,
        mediaUrl,
      );

      // 1. Deliver in real-time to receiver
      this.server.to(`user_${receiverId}`).emit('receive_message', savedMessage);

      // 2. Acknowledge back to sender
      this.server.to(`user_${senderId}`).emit('message_sent', savedMessage);

      // 3. Notify conversation list updates
      this.server.to(`user_${receiverId}`).emit('conversation_updated', {
        partnerId: senderId,
        lastMessage: savedMessage,
      });
      this.server.to(`user_${senderId}`).emit('conversation_updated', {
        partnerId: receiverId,
        lastMessage: savedMessage,
      });

      return savedMessage;
    } catch (err) {
      client.emit('error', { message: err.message });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      isTyping: boolean;
    },
  ) {
    const { senderId, receiverId, isTyping } = data;
    if (receiverId) {
      this.server
        .to(`user_${receiverId}`)
        .emit('user_typing', { userId: senderId, isTyping });
    }
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @MessageBody() data: { userId: string; otherUserId: string },
  ) {
    const { userId, otherUserId } = data;
    if (!userId || !otherUserId) return;

    await this.chatService.markAsRead(userId, otherUserId);

    // Notify the other user that their messages were read
    this.server
      .to(`user_${otherUserId}`)
      .emit('messages_read', { readBy: userId });
  }
}
