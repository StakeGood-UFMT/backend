import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class StakeGoodGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`WS connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`WS disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe_market')
  handleSubscribeMarket(client: Socket, marketId: string) {
    client.join(`market:${marketId}`);
  }

  emitTxConfirmed(userId: string, payload: any) {
    this.server.to(`user:${userId}`).emit('tx_confirmed', payload);
  }

  emitMarketResolved(marketId: string, payload: any) {
    this.server.to(`market:${marketId}`).emit('market_resolved', payload);
  }

  emitNotification(userId: string, payload: any) {
    this.server.to(`user:${userId}`).emit('notification_created', payload);
  }
}
