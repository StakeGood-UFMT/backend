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
exports.ImpactService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const impact_ledger_entry_entity_1 = require("../../database/entities/impact-ledger-entry.entity");
const uuid_1 = require("uuid");
let ImpactService = class ImpactService {
    ledgerRepo;
    constructor(ledgerRepo) {
        this.ledgerRepo = ledgerRepo;
    }
    async getLedger(options) {
        const query = this.ledgerRepo.createQueryBuilder('e').orderBy('e.date', 'DESC');
        if (options.from)
            query.andWhere('e.date >= :from', { from: new Date(options.from) });
        if (options.to)
            query.andWhere('e.date <= :to', { to: new Date(options.to) });
        if (options.ngoId)
            query.andWhere('e.ngo_id = :ngoId', { ngoId: options.ngoId });
        query.skip(options.offset).take(options.limit);
        const [entries, total] = await query.getManyAndCount();
        const totalDistributed = entries.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        return {
            ledger_entries: entries,
            pagination: { total, limit: options.limit, offset: options.offset, has_next: options.offset + options.limit < total },
            summary: {
                period: { from: options.from, to: options.to },
                total_distributed: totalDistributed.toFixed(2),
                transaction_count: total,
            },
        };
    }
    async exportLedger(body) {
        const jobId = `job_${(0, uuid_1.v4)().replace(/-/g, '').slice(0, 9)}`;
        const estimatedReadyAt = new Date(Date.now() + 2 * 60 * 1000);
        return {
            job_id: jobId,
            status: 'queued',
            format: body.format,
            estimated_ready_at: estimatedReadyAt.toISOString(),
            download_url: null,
            check_status_url: `/api/v1/impact/ledger/export/${jobId}`,
        };
    }
};
exports.ImpactService = ImpactService;
exports.ImpactService = ImpactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(impact_ledger_entry_entity_1.ImpactLedgerEntryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ImpactService);
//# sourceMappingURL=impact.service.js.map