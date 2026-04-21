"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeGoodGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let StakeGoodGateway = class StakeGoodGateway {
    server;
    handleConnection(client) {
        console.log(`WS connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`WS disconnected: ${client.id}`);
    }
    handleSubscribeMarket(client, marketId) {
        client.join(`market:${marketId}`);
    }
    emitTxConfirmed(userId, payload) {
        this.server.to(`user:${userId}`).emit('tx_confirmed', payload);
    }
    emitMarketResolved(marketId, payload) {
        this.server.to(`market:${marketId}`).emit('market_resolved', payload);
    }
    emitNotification(userId, payload) {
        this.server.to(`user:${userId}`).emit('notification_created', payload);
    }
};
exports.StakeGoodGateway = StakeGoodGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], StakeGoodGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe_market'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], StakeGoodGateway.prototype, "handleSubscribeMarket", null);
exports.StakeGoodGateway = StakeGoodGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], StakeGoodGateway);
//# sourceMappingURL=stakegood.gateway.js.map