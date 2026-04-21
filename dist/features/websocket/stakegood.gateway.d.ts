import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class StakeGoodGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribeMarket(client: Socket, marketId: string): void;
    emitTxConfirmed(userId: string, payload: any): void;
    emitMarketResolved(marketId: string, payload: any): void;
    emitNotification(userId: string, payload: any): void;
}
