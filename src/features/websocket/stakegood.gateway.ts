import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway({ path: '/ws' })
export class StakeGoodGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: any;

  private readonly userClients = new Map<string, Set<any>>();

  private parseWalletFromConnectionArgs(args: any[]): string | null {
    const req = args?.[0];
    const url: string | undefined =
      req?.url ??
      req?.originalUrl ??
      req?.handshake?.url ??
      req?.handshake?.headers?.referer;

    if (typeof url !== 'string') return null;

    const idx = url.indexOf('?');
    if (idx === -1) return null;

    const query = url.slice(idx + 1);
    const params = new URLSearchParams(query);
    const wallet = params.get('wallet');
    return wallet && wallet.length > 0 ? wallet : null;
  }

  private addUserClient(userId: string, client: any) {
    const existing = this.userClients.get(userId);
    if (existing) {
      existing.add(client);
      return;
    }
    this.userClients.set(userId, new Set([client]));
  }

  private removeClient(client: any) {
    for (const [userId, clients] of this.userClients.entries()) {
      if (!clients.has(client)) continue;
      clients.delete(client);
      if (clients.size === 0) this.userClients.delete(userId);
    }
  }

  private safeSend(client: any, message: string) {
    try {
      if (typeof client?.send !== 'function') return;
      const readyState = client?.readyState;
      if (typeof readyState === 'number' && readyState !== 1) return;
      client.send(message);
    } catch {}
  }

  private emitToUser(userId: string, event: string, payload: any) {
    const message = JSON.stringify({ event, data: payload });

    const clients = this.userClients.get(userId);
    if (clients && clients.size > 0) {
      for (const client of clients) this.safeSend(client, message);
      return;
    }

    const serverTo = this.server?.to;
    if (typeof serverTo === 'function') {
      this.server.to(`user:${userId}`).emit(event, payload);
      return;
    }

    const allClients: Iterable<any> | undefined = this.server?.clients;
    if (allClients) {
      for (const client of allClients) this.safeSend(client, message);
    }
  }

  private emitToMarket(marketId: string, event: string, payload: any) {
    const serverTo = this.server?.to;
    if (typeof serverTo === 'function') {
      this.server.to(`market:${marketId}`).emit(event, payload);
      return;
    }

    const allClients: Iterable<any> | undefined = this.server?.clients;
    if (!allClients) return;

    const message = JSON.stringify({ event, data: payload });
    for (const client of allClients) this.safeSend(client, message);
  }

  handleConnection(client: any, ...args: any[]) {
    const wallet = this.parseWalletFromConnectionArgs(args);
    if (wallet) {
      this.addUserClient(wallet, client);
    }
    console.log('WS connected');
  }

  handleDisconnect(client: any) {
    this.removeClient(client);
    console.log('WS disconnected');
  }

  @SubscribeMessage('subscribe_market')
  handleSubscribeMarket(client: any, marketId: string) {
    // Note: Room support is not native to 'ws' library,
    // it would need manual implementation or a library like 'socket.io'.
    // However, we are switching to match frontend expectations.
    console.log(`Subscribing to market: ${marketId}`);
  }

  @SubscribeMessage('subscribe_user')
  handleSubscribeUser(client: any, userId: string) {
    if (!userId) return;
    this.addUserClient(userId, client);
  }

  emitKycStatusUpdated(
    userId: string,
    payload: { status: string; updatedAt: string },
  ) {
    this.emitToUser(userId, 'kyc_status_updated', payload);
  }

  emitTxConfirmed(userId: string, payload: any) {
    this.emitToUser(userId, 'tx_confirmed', payload);
  }

  emitMarketResolved(marketId: string, payload: any) {
    this.emitToMarket(marketId, 'market_resolved', payload);
  }

  emitNotification(userId: string, payload: any) {
    this.emitToUser(userId, 'notification_created', payload);
  }
}
