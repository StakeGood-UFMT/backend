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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity {
    id;
    primaryWallet;
    role;
    kycStatus;
    kycTier;
    publicVisibility;
    privateMode;
    spendingLimitUsd;
    spendingWindowDays;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'primary_wallet', length: 56 }),
    __metadata("design:type", String)
], UserEntity.prototype, "primaryWallet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['user', 'moderator', 'admin'], default: 'user' }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'kyc_status', type: 'enum', enum: ['pending', 'verified', 'rejected', 'expired'], default: 'pending' }),
    __metadata("design:type", String)
], UserEntity.prototype, "kycStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kyc_tier', type: 'enum', enum: ['individual', 'business'], default: 'individual' }),
    __metadata("design:type", String)
], UserEntity.prototype, "kycTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'public_visibility', default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "publicVisibility", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'private_mode', default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "privateMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'spending_limit_usd', type: 'decimal', precision: 10, scale: 2, default: 5000.00 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "spendingLimitUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'spending_window_days', type: 'int', default: 30 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "spendingWindowDays", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at', nullable: true }),
    __metadata("design:type", Date)
], UserEntity.prototype, "deletedAt", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);
//# sourceMappingURL=user.entity.js.map