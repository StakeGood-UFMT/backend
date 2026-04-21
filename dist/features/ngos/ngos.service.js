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
exports.NgosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ngo_entity_1 = require("../../database/entities/ngo.entity");
let NgosService = class NgosService {
    ngoRepo;
    constructor(ngoRepo) {
        this.ngoRepo = ngoRepo;
    }
    async findAll(options) {
        const query = this.ngoRepo.createQueryBuilder('n');
        if (options.category)
            query.andWhere('n.category = :category', { category: options.category });
        if (options.verified !== undefined)
            query.andWhere('n.verified = :verified', { verified: options.verified });
        if (options.sort === 'alphabetical') {
            query.orderBy('n.name', 'ASC');
        }
        else {
            query.orderBy('n.total_funds_received', 'DESC');
        }
        query.skip(options.offset).take(options.limit);
        const [ngos, total] = await query.getManyAndCount();
        return {
            ngos,
            pagination: { total, limit: options.limit, offset: options.offset, has_next: options.offset + options.limit < total },
        };
    }
};
exports.NgosService = NgosService;
exports.NgosService = NgosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ngo_entity_1.NgoEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NgosService);
//# sourceMappingURL=ngos.service.js.map