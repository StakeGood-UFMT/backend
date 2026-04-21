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
exports.NgosController = void 0;
const common_1 = require("@nestjs/common");
const ngos_service_1 = require("./ngos.service");
let NgosController = class NgosController {
    ngosService;
    constructor(ngosService) {
        this.ngosService = ngosService;
    }
    findAll(category, verified, limit = 20, offset = 0, sort = 'trending') {
        return this.ngosService.findAll({
            category,
            verified: verified !== undefined ? verified === 'true' : undefined,
            limit: +limit,
            offset: +offset,
            sort,
        });
    }
};
exports.NgosController = NgosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('verified')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], NgosController.prototype, "findAll", null);
exports.NgosController = NgosController = __decorate([
    (0, common_1.Controller)('ngos'),
    __metadata("design:paramtypes", [ngos_service_1.NgosService])
], NgosController);
//# sourceMappingURL=ngos.controller.js.map