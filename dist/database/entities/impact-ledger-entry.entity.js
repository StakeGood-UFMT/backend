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
exports.ImpactLedgerEntryEntity = void 0;
const typeorm_1 = require("typeorm");
let ImpactLedgerEntryEntity = class ImpactLedgerEntryEntity {
    id;
    date;
    marketId;
    ngoId;
    amount;
    currency;
    source;
    txHash;
    breakdown;
    createdAt;
};
exports.ImpactLedgerEntryEntity = ImpactLedgerEntryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ImpactLedgerEntryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ImpactLedgerEntryEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'market_id', nullable: true }),
    __metadata("design:type", String)
], ImpactLedgerEntryEntity.prototype, "marketId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'ngo_id' }),
    __metadata("design:type", String)
], ImpactLedgerEntryEntity.prototype, "ngoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], ImpactLedgerEntryEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12, default: 'USDC' }),
    __metadata("design:type", String)
], ImpactLedgerEntryEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'enum', enum: ['quadratic_voting', 'donation', 'grant', 'fee_pool'], default: 'quadratic_voting' }),
    __metadata("design:type", String)
], ImpactLedgerEntryEntity.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tx_hash', length: 64, nullable: true }),
    __metadata("design:type", String)
], ImpactLedgerEntryEntity.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ImpactLedgerEntryEntity.prototype, "breakdown", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ImpactLedgerEntryEntity.prototype, "createdAt", void 0);
exports.ImpactLedgerEntryEntity = ImpactLedgerEntryEntity = __decorate([
    (0, typeorm_1.Entity)('impact_ledger_entries')
], ImpactLedgerEntryEntity);
//# sourceMappingURL=impact-ledger-entry.entity.js.map