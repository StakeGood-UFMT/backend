"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stellar_worker_service_1 = require("./stellar-worker.service");
const user_position_entity_1 = require("../../database/entities/user-position.entity");
const market_snapshot_entity_1 = require("../../database/entities/market-snapshot.entity");
const deposit_entity_1 = require("../../database/entities/deposit.entity");
const websocket_module_1 = require("../websocket/websocket.module");
let WorkerModule = class WorkerModule {
};
exports.WorkerModule = WorkerModule;
exports.WorkerModule = WorkerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_position_entity_1.UserPositionEntity, market_snapshot_entity_1.MarketSnapshotEntity, deposit_entity_1.DepositEntity]),
            websocket_module_1.WebsocketModule,
        ],
        providers: [stellar_worker_service_1.StellarWorkerService],
        exports: [stellar_worker_service_1.StellarWorkerService],
    })
], WorkerModule);
//# sourceMappingURL=worker.module.js.map