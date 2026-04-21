"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const impact_controller_1 = require("./impact.controller");
const impact_service_1 = require("./impact.service");
const impact_ledger_entry_entity_1 = require("../../database/entities/impact-ledger-entry.entity");
const ngo_entity_1 = require("../../database/entities/ngo.entity");
let ImpactModule = class ImpactModule {
};
exports.ImpactModule = ImpactModule;
exports.ImpactModule = ImpactModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([impact_ledger_entry_entity_1.ImpactLedgerEntryEntity, ngo_entity_1.NgoEntity])],
        controllers: [impact_controller_1.ImpactController],
        providers: [impact_service_1.ImpactService],
    })
], ImpactModule);
//# sourceMappingURL=impact.module.js.map