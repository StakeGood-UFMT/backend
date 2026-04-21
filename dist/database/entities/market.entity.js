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
exports.MarketEntity = void 0;
const typeorm_1 = require("typeorm");
let MarketEntity = class MarketEntity {
    id;
    title;
    description;
    category;
    status;
    lockAt;
    resolveAt;
    outcome;
    oracleRef;
    assetCode;
    assetIssuer;
    createdBy;
    createdAt;
    updatedAt;
};
exports.MarketEntity = MarketEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MarketEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], MarketEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MarketEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], MarketEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'enum', enum: ['draft', 'active', 'locked', 'resolved'], default: 'draft' }),
    __metadata("design:type", String)
], MarketEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'lock_at' }),
    __metadata("design:type", Date)
], MarketEntity.prototype, "lockAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolve_at' }),
    __metadata("design:type", Date)
], MarketEntity.prototype, "resolveAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['YES', 'NO'], nullable: true }),
    __metadata("design:type", String)
], MarketEntity.prototype, "outcome", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oracle_ref', length: 200, nullable: true }),
    __metadata("design:type", String)
], MarketEntity.prototype, "oracleRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_code', length: 12, nullable: true }),
    __metadata("design:type", String)
], MarketEntity.prototype, "assetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_issuer', length: 56, nullable: true }),
    __metadata("design:type", String)
], MarketEntity.prototype, "assetIssuer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], MarketEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MarketEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], MarketEntity.prototype, "updatedAt", void 0);
exports.MarketEntity = MarketEntity = __decorate([
    (0, typeorm_1.Entity)('markets')
], MarketEntity);
//# sourceMappingURL=market.entity.js.map