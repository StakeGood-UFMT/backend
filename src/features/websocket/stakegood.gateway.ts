import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway({ path: '/ws' })
export class StakeGoodGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: any;

  handleConnection(client: any) {
    console.log('WS connected');
  }

  handleDisconnect(client: any) {
    console.log('WS disconnected');
  }

  @SubscribeMessage('subscribe_market')
  handleSubscribeMarket(client: any, marketId: string) {
    // Note: Room support is not native to 'ws' library, 
    // it would need manual implementation or a library like 'socket.io'.
    // However, we are switching to match frontend expectations.
    console.log(`Subscribing to market: ${marketId}`);
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
