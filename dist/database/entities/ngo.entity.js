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
exports.NgoEntity = void 0;
const typeorm_1 = require("typeorm");
let NgoEntity = class NgoEntity {
    id;
    name;
    slug;
    description;
    category;
    verified;
    verificationDate;
    verifiedBy;
    walletAddress;
    website;
    social;
    impactMetrics;
    totalFundsReceived;
    createdAt;
    updatedAt;
};
exports.NgoEntity = NgoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NgoEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], NgoEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], NgoEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NgoEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], NgoEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], NgoEntity.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verification_date', nullable: true }),
    __metadata("design:type", Date)
], NgoEntity.prototype, "verificationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verified_by', nullable: true }),
    __metadata("design:type", String)
], NgoEntity.prototype, "verifiedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'wallet_address', length: 56, unique: true }),
    __metadata("design:type", String)
], NgoEntity.prototype, "walletAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], NgoEntity.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], NgoEntity.prototype, "social", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'impact_metrics', type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], NgoEntity.prototype, "impactMetrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_funds_received', type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], NgoEntity.prototype, "totalFundsReceived", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NgoEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], NgoEntity.prototype, "updatedAt", void 0);
exports.NgoEntity = NgoEntity = __decorate([
    (0, typeorm_1.Entity)('ngos')
], NgoEntity);
//# sourceMappingURL=ngo.entity.js.map