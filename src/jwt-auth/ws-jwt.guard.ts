import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // 1. Extract the Socket.IO client from WebSocket context
    const wsContext = context.switchToWs();
    const client: Socket = wsContext.getClient<Socket>();

    // 2. Extract authorization header or handshake auth payload
    const bearerToken =
      client.handshake?.auth?.token ||
      client.handshake?.headers?.authorization;

    // 3. Return a mock HTTP request object for Passport to extract the JWT from
    return {
      headers: {
        authorization: bearerToken?.startsWith('Bearer ')
          ? bearerToken
          : `Bearer ${bearerToken}`,
      },
    };
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing WebSocket token');
    }

    // Attach validated user to the Socket client instance for downstream handlers
    const client: Socket = context.switchToWs().getClient<Socket>();
    (client as any).user = user;

    return user;
  }
}