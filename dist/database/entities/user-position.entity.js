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
exports.UserPositionEntity = void 0;
const typeorm_1 = require("typeorm");
let UserPositionEntity = class UserPositionEntity {
    id;
    userId;
    marketId;
    outcome;
    amountStaked;
    status;
    txHash;
    resolvedAt;
    payoutAmount;
    createdAt;
    updatedAt;
};
exports.UserPositionEntity = UserPositionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserPositionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], UserPositionEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'market_id' }),
    __metadata("design:type", String)
], UserPositionEntity.prototype, "marketId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['YES', 'NO'] }),
    __metadata("design:type", String)
], UserPositionEntity.prototype, "outcome", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_staked', type: 'decimal', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], UserPositionEntity.prototype, "amountStaked", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled', 'resolved', 'claimed'], default: 'pending' }),
    __metadata("design:type", String)
], UserPositionEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'tx_hash', length: 64, nullable: true }),
    __metadata("design:type", String)
], UserPositionEntity.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolved_at', nullable: true }),
    __metadata("design:type", Date)
], UserPositionEntity.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payout_amount', type: 'decimal', precision: 18, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], UserPositionEntity.prototype, "payoutAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserPositionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UserPositionEntity.prototype, "updatedAt", void 0);
exports.UserPositionEntity = UserPositionEntity = __decorate([
    (0, typeorm_1.Entity)('user_positions')
], UserPositionEntity);
//# sourceMappingURL=user-position.entity.js.map