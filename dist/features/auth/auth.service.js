"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const typeorm_2 = require("typeorm");
const crypto = __importStar(require("crypto"));
const user_entity_1 = require("../../database/entities/user.entity");
const auth_nonce_entity_1 = require("../../database/entities/auth-nonce.entity");
let AuthService = class AuthService {
    userRepo;
    nonceRepo;
    jwtService;
    constructor(userRepo, nonceRepo, jwtService) {
        this.userRepo = userRepo;
        this.nonceRepo = nonceRepo;
        this.jwtService = jwtService;
    }
    async generateNonce(wallet) {
        if (!wallet || wallet.length !== 56 || !wallet.startsWith('G')) {
            throw new common_1.BadRequestException('Invalid Stellar wallet address');
        }
        const nonce = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.nonceRepo.save({ walletAddress: wallet, nonce, expiresAt });
        return { nonce, expires_at: expiresAt.toISOString(), ttl_seconds: 300 };
    }
    async verifySignature(dto) {
        const { wallet, nonce, signature: _signature } = dto;
        const nonceRecord = await this.nonceRepo.findOne({
            where: { walletAddress: wallet, nonce },
        });
        if (!nonceRecord || nonceRecord.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired nonce');
        }
        if (nonceRecord.usedAt) {
            throw new common_1.BadRequestException('Nonce already used');
        }
        await this.nonceRepo.update(nonceRecord.id, { usedAt: new Date() });
        let user = await this.userRepo.findOne({ where: { primaryWallet: wallet } });
        if (!user) {
            user = await this.userRepo.save({ primaryWallet: wallet });
        }
        const token = this.jwtService.sign({
            sub: wallet,
            userId: user.id,
            kyc_status: user.kycStatus,
            kyc_tier: user.kycTier,
            role: user.role,
        });
        return {
            jwt: token,
            wallet,
            kyc_status: user.kycStatus,
            kyc_tier: user.kycTier,
            expires_in: 86400,
            user: {
                id: user.id,
                primary_wallet: user.primaryWallet,
                role: user.role,
                public_visibility: user.publicVisibility,
            },
        };
    }
    async processKycWebhook(dto) {
        const user = await this.userRepo.findOne({
            where: { id: dto.externalUserId },
        });
        if (!user)
            return { status: 'ignored' };
        const status = dto.review.reviewStatus === 'approved' ? 'verified' : 'rejected';
        await this.userRepo.update(user.id, { kycStatus: status });
        return { status: 'processed' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(auth_nonce_entity_1.AuthNonceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map