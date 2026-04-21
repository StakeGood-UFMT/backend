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
exports.AuthNonceEntity = void 0;
const typeorm_1 = require("typeorm");
let AuthNonceEntity = class AuthNonceEntity {
    id;
    walletAddress;
    nonce;
    expiresAt;
    usedAt;
    createdAt;
};
exports.AuthNonceEntity = AuthNonceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuthNonceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'wallet_address', length: 56 }),
    __metadata("design:type", String)
], AuthNonceEntity.prototype, "walletAddress", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ length: 64 }),
    __metadata("design:type", String)
], AuthNonceEntity.prototype, "nonce", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'expires_at' }),
    __metadata("design:type", Date)
], AuthNonceEntity.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'used_at', nullable: true }),
    __metadata("design:type", Date)
], AuthNonceEntity.prototype, "usedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AuthNonceEntity.prototype, "createdAt", void 0);
exports.AuthNonceEntity = AuthNonceEntity = __decorate([
    (0, typeorm_1.Entity)('auth_nonces')
], AuthNonceEntity);
//# sourceMappingURL=auth-nonce.entity.js.map