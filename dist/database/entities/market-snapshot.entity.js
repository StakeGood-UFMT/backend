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
exports.MarketSnapshotEntity = void 0;
const typeorm_1 = require("typeorm");
let MarketSnapshotEntity = class MarketSnapshotEntity {
    id;
    marketId;
    timestamp;
    yesPool;
    noPool;
    tradingVolume;
    createdAt;
    get impliedProbYes() {
        return this.yesPool / (this.yesPool + this.noPool);
    }
};
exports.MarketSnapshotEntity = MarketSnapshotEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MarketSnapshotEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'market_id' }),
    __metadata("design:type", String)
], MarketSnapshotEntity.prototype, "marketId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], MarketSnapshotEntity.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'yes_pool', type: 'decimal', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], MarketSnapshotEntity.prototype, "yesPool", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'no_pool', type: 'decimal', precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], MarketSnapshotEntity.prototype, "noPool", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trading_volume', type: 'decimal', precision: 18, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], MarketSnapshotEntity.prototype, "tradingVolume", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MarketSnapshotEntity.prototype, "createdAt", void 0);
exports.MarketSnapshotEntity = MarketSnapshotEntity = __decorate([
    (0, typeorm_1.Entity)('market_snapshots'),
    (0, typeorm_1.Index)(['marketId', 'timestamp'])
], MarketSnapshotEntity);
//# sourceMappingURL=market-snapshot.entity.js.map