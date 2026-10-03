import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer() server!: Server;

    constructor(private jwtService: JwtService) { }

    // app connect hote waqt token check karo, galat hai toh connection kaat do
    handleConnection(client: Socket) {
        try {
            const payload = this.jwtService.verify(client.handshake.auth?.token);
            client.data.userId = payload.sub;
            client.join(`user:${payload.sub}`); // har user ka apna "room"
        } catch {
            client.disconnect();
        }
    }

    // naya message: bhejne wale aur paane wale, dono ko batao
    notifyNewMessage(message: any) {
        this.server
            .to(`user:${String(message.to)}`)
            .to(`user:${String(message.from)}`)
            .emit('message:new', message);
    }

    // readerId ne otherId ke messages padh liye, toh otherId ko batao (✓✓)
    notifyRead(readerId: string, otherId: string) {
        this.server.to(`user:${otherId}`).emit('message:read', { by: readerId });
    }
}