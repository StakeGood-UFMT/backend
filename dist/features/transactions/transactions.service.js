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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../database/entities/user.entity");
const market_entity_1 = require("../../database/entities/market.entity");
const market_snapshot_entity_1 = require("../../database/entities/market-snapshot.entity");
const deposit_entity_1 = require("../../database/entities/deposit.entity");
let TransactionsService = class TransactionsService {
    userRepo;
    marketRepo;
    snapshotRepo;
    depositRepo;
    constructor(userRepo, marketRepo, snapshotRepo, depositRepo) {
        this.userRepo = userRepo;
        this.marketRepo = marketRepo;
        this.snapshotRepo = snapshotRepo;
        this.depositRepo = depositRepo;
    }
    async buildPrediction(dto, jwtUser) {
        const user = await this.userRepo.findOne({ where: { id: jwtUser.userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.kycStatus !== 'verified') {
            throw new common_1.ForbiddenException({ error: 'KYC_REQUIRED', kyc_status: user.kycStatus });
        }
        await this.checkSpendingLimit(user, parseFloat(dto.amount));
        const market = await this.marketRepo.findOne({ where: { id: dto.market_id } });
        if (!market)
            throw new common_1.NotFoundException('Market not found');
        if (market.status !== 'active') {
            throw new common_1.BadRequestException('Market is not active');
        }
        if (new Date() >= market.lockAt) {
            throw new common_1.BadRequestException('Market is locked for betting');
        }
        const snapshot = await this.snapshotRepo.findOne({
            where: { marketId: market.id },
            order: { timestamp: 'DESC' },
        });
        const yesPool = snapshot ? parseFloat(snapshot.yesPool) : 50000;
        const noPool = snapshot ? parseFloat(snapshot.noPool) : 50000;
        const amount = parseFloat(dto.amount);
        const impliedProbability = yesPool / (yesPool + noPool);
        const payoutMultiplier = dto.outcome === 'YES'
            ? (yesPool + noPool + amount) / (yesPool + amount)
            : (yesPool + noPool + amount) / (noPool + amount);
        const potentialWin = amount * payoutMultiplier;
        const xdr = 'PLACEHOLDER_XDR_BASE64';
        return {
            xdr,
            summary: {
                action: 'place_prediction',
                market: { id: market.id, title: market.title },
                outcome: dto.outcome,
                amount: `${dto.amount} USDC`,
                implied_probability: impliedProbability.toFixed(3),
                implied_odds: payoutMultiplier.toFixed(2),
                potential_win: `${potentialWin.toFixed(2)} USDC`,
            },
        };
    }
    async checkSpendingLimit(user, amount) {
        const windowStart = new Date(Date.now() - user.spendingWindowDays * 24 * 60 * 60 * 1000);
        const result = await this.depositRepo
            .createQueryBuilder('d')
            .select('COALESCE(SUM(d.amount), 0)', 'total')
            .where('d.user_id = :userId', { userId: user.id })
            .andWhere('d.created_at >= :windowStart', { windowStart })
            .andWhere("d.status = 'confirmed'")
            .getRawOne();
        const totalSpent = parseFloat(result?.total ?? '0');
        const remaining = user.spendingLimitUsd - totalSpent;
        if (totalSpent + amount > user.spendingLimitUsd) {
            throw new common_1.ForbiddenException({
                error: 'SPENDING_LIMIT_EXCEEDED',
                remaining: remaining.toFixed(2),
            });
        }
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(market_entity_1.MarketEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(market_snapshot_entity_1.MarketSnapshotEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(deposit_entity_1.DepositEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map