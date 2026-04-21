"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ngos_controller_1 = require("./ngos.controller");
const ngos_service_1 = require("./ngos.service");
const ngo_entity_1 = require("../../database/entities/ngo.entity");
let NgosModule = class NgosModule {
};
exports.NgosModule = NgosModule;
exports.NgosModule = NgosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ngo_entity_1.NgoEntity])],
        controllers: [ngos_controller_1.NgosController],
        providers: [ngos_service_1.NgosService],
        exports: [ngos_service_1.NgosService],
    })
], NgosModule);
//# sourceMappingURL=ngos.module.js.map