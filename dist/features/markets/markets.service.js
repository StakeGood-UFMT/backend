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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const market_entity_1 = require("../../database/entities/market.entity");
const market_snapshot_entity_1 = require("../../database/entities/market-snapshot.entity");
let MarketsService = class MarketsService {
    marketRepo;
    snapshotRepo;
    constructor(marketRepo, snapshotRepo) {
        this.marketRepo = marketRepo;
        this.snapshotRepo = snapshotRepo;
    }
    async findAll(options) {
        const query = this.marketRepo.createQueryBuilder('m');
        if (options.status)
            query.andWhere('m.status = :status', { status: options.status });
        if (options.category)
            query.andWhere('m.category = :category', { category: options.category });
        const orderMap = {
            newest: 'created_at DESC',
            oldest: 'created_at ASC',
        };
        const order = orderMap[options.sort] ?? 'created_at DESC';
        query.orderBy(`m.${order.split(' ')[0]}`, order.includes('ASC') ? 'ASC' : 'DESC');
        query.skip(options.offset).take(options.limit);
        const [markets, total] = await query.getManyAndCount();
        return {
            markets,
            pagination: { total, limit: options.limit, offset: options.offset, has_next: options.offset + options.limit < total },
        };
    }
    async getHistory(marketId, _interval, days) {
        const market = await this.marketRepo.findOne({ where: { id: marketId } });
        if (!market)
            throw new common_1.NotFoundException('Market not found');
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const snapshots = await this.snapshotRepo.createQueryBuilder('s')
            .where('s.market_id = :marketId', { marketId })
            .andWhere('s.timestamp >= :since', { since })
            .orderBy('s.timestamp', 'ASC')
            .getMany();
        return {
            market_id: marketId,
            title: market.title,
            snapshots: snapshots.map((s) => ({
                timestamp: s.timestamp,
                yes_pool: s.yesPool,
                no_pool: s.noPool,
                yes_probability: s.impliedProbYes,
                trading_volume: s.tradingVolume,
            })),
        };
    }
};
exports.MarketsService = MarketsService;
exports.MarketsService = MarketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(market_entity_1.MarketEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(market_snapshot_entity_1.MarketSnapshotEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MarketsService);
//# sourceMappingURL=markets.service.js.map