import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody,
  ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, 
  WsException} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { DirectMessageService } from './direct-message.service';

interface AuthenticatedSocket extends Socket {
  user?: any;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Allow connections from Ionic app
  },
})
export class DirectMessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  constructor(
    private readonly directServe: DirectMessageService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try{
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

      if(!token){
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token,{
        secret: process.env.JWT_SECRET || 'YOUR_SECRET_KEY'
      });

      client.user = payload;
      return{
        message: `Authenticated user connected: ${payload.sub || payload.userId}`
      }
    }catch(err){
      console.error('Unauthorized WebSocket connection attempt');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // --- PRIVATE ROOM MANAGEMENT ---

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data:{roomId: string; userId: string}){
    if (!data?.roomId) {
      throw new WsException('Room ID is required.');
    }

    const currentUserId = client.user?.sub || client.user?.userId || client.user?._id;

    // Basic security check: Ensure current authenticated user is part of the room ID
    if (currentUserId && !data.roomId.includes(currentUserId.toString())) {
      throw new WsException('Unauthorized: You are not a participant of this room.');
    }

    await client.join(data.roomId);
    if (data.userId) {
      await this.directServe.markAsRead(data.roomId, data.userId);
    }

    // Broadcast user joined event to other members in the room
    client.to(data.roomId).emit('userJoined', {
      userId: data.userId || currentUserId,
      roomId: data.roomId,
      message: `User joined room ${data.roomId}`,
    });

    return { status: 'success', roomId: data.roomId };
  }

  // Listen for messages emitted from Ionic
  @SubscribeMessage('sendPrivateMessage')
  async handlePrivateMessage(
    @MessageBody() payload: { 
        roomId:             string;
        senderId:           string;
        senderFirstName:    string;
        senderLastName:     string;
        senderEmail:        string;
        senderUserName:     string;
        receiverId:         string;
        receiverFirstName:  string;
        receiverLastName:   string;
        receiverEmail:      string;
        receiverUserName:   string;
        message:            string;
    },
  ) {
    try{
      // 1. Validate payload structure
      if (!payload.roomId || !payload.senderId) {
        throw new WsException('Missing roomID or senderId in payload');
      }

      // 2. Map payload keys to match DirectMessage interface/schema keys exactly
      const messageData = {
        ...payload,
      };

      // 3. Save to database
      const saveMessage = await this.directServe.createMessage(messageData);

      this.server.to(payload.roomId).emit('newMessage', saveMessage);
      return saveMessage;
    }
    catch(err){
      console.error('Error handling private message:', err);
    }
  }
}