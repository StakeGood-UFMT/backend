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
var StellarWorkerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarWorkerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const user_position_entity_1 = require("../../database/entities/user-position.entity");
const market_snapshot_entity_1 = require("../../database/entities/market-snapshot.entity");
const stakegood_gateway_1 = require("../websocket/stakegood.gateway");
let StellarWorkerService = StellarWorkerService_1 = class StellarWorkerService {
    positionRepo;
    snapshotRepo;
    gateway;
    config;
    logger = new common_1.Logger(StellarWorkerService_1.name);
    running = false;
    constructor(positionRepo, snapshotRepo, gateway, config) {
        this.positionRepo = positionRepo;
        this.snapshotRepo = snapshotRepo;
        this.gateway = gateway;
        this.config = config;
    }
    onModuleInit() {
        if (this.config.get('NODE_ENV') !== 'test') {
            this.startListening();
        }
    }
    onModuleDestroy() {
        this.running = false;
    }
    startListening() {
        this.running = true;
        this.logger.log('Stellar worker started — listening for on-chain events');
    }
    async processTransaction(txHash, _xdrData) {
        const existing = await this.positionRepo.findOne({ where: { txHash } });
        if (existing) {
            this.logger.debug(`Duplicate tx ignored: ${txHash}`);
            return;
        }
    }
};
exports.StellarWorkerService = StellarWorkerService;
exports.StellarWorkerService = StellarWorkerService = StellarWorkerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_position_entity_1.UserPositionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(market_snapshot_entity_1.MarketSnapshotEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        stakegood_gateway_1.StakeGoodGateway,
        config_1.ConfigService])
], StellarWorkerService);
//# sourceMappingURL=stellar-worker.service.js.map