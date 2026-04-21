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
exports.DepositEntity = void 0;
const typeorm_1 = require("typeorm");
let DepositEntity = class DepositEntity {
    id;
    userId;
    amount;
    currency;
    txHash;
    status;
    createdAt;
    confirmedAt;
};
exports.DepositEntity = DepositEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DepositEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], DepositEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], DepositEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12, default: 'USDC' }),
    __metadata("design:type", String)
], DepositEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tx_hash', length: 64, unique: true }),
    __metadata("design:type", String)
], DepositEntity.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'confirmed', 'failed'], default: 'pending' }),
    __metadata("design:type", String)
], DepositEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DepositEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmed_at', nullable: true }),
    __metadata("design:type", Date)
], DepositEntity.prototype, "confirmedAt", void 0);
exports.DepositEntity = DepositEntity = __decorate([
    (0, typeorm_1.Entity)('deposits')
], DepositEntity);
//# sourceMappingURL=deposit.entity.js.map