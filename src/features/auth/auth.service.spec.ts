import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthNonceEntity } from '../../database/entities/auth-nonce.entity';
import { KycProfileEntity } from '../../database/entities/kyc-profile.entity';
import { RefreshTokenEntity } from '../../database/entities/refresh_tokens';
import { StakeGoodGateway } from '../websocket/stakegood.gateway';

const mockUser = (overrides: Partial<UserEntity> = {}): UserEntity =>
  ({
    id: 'user-uuid',
    primaryWallet: 'GABC',
    kycStatus: 'pending',
    ...overrides,
  }) as UserEntity;

const mockRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
});

const mockGateway = { emitKycStatusUpdated: jest.fn() };

describe('AuthService – KYC Webhook', () => {
  let service: AuthService;
  let userRepo: ReturnType<typeof mockRepo>;
  let kycProfileRepo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UserEntity), useFactory: mockRepo },
        { provide: getRepositoryToken(AuthNonceEntity), useFactory: mockRepo },
        { provide: getRepositoryToken(KycProfileEntity), useFactory: mockRepo },
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useFactory: mockRepo,
        },
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: StakeGoodGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    kycProfileRepo = module.get(getRepositoryToken(KycProfileEntity));
    jest.clearAllMocks();
  });

  describe('test_user_status_update', () => {
    it('atualiza users.kyc_status para verified quando review é approved', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      kycProfileRepo.findOne.mockResolvedValue(null);
      kycProfileRepo.save.mockResolvedValue({});

      const result = await service.processKycWebhook({
        externalUserId: 'user-uuid',
        review: { reviewStatus: 'approved' },
        applicant: { id: 'sumsub-app-id' },
      });

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid', {
        kycStatus: 'verified',
      });
      expect(result).toEqual({ status: 'processed' });
    });

    it('atualiza users.kyc_status para rejected quando review não é approved', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      kycProfileRepo.findOne.mockResolvedValue(null);
      kycProfileRepo.save.mockResolvedValue({});

      await service.processKycWebhook({
        externalUserId: 'user-uuid',
        review: { reviewStatus: 'rejected' },
        applicant: { id: 'sumsub-app-id' },
      });

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid', {
        kycStatus: 'rejected',
      });
    });

    it('ignora webhook quando usuário não existe', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.processKycWebhook({
        externalUserId: 'nao-existe',
        review: { reviewStatus: 'approved' },
      });

      expect(result).toEqual({ status: 'ignored' });
      expect(userRepo.update).not.toHaveBeenCalled();
    });

    it('idempotência: não reverte verified para rejected em webhook duplicado', async () => {
      userRepo.findOne.mockResolvedValue(mockUser({ kycStatus: 'verified' }));

      const result = await service.processKycWebhook({
        externalUserId: 'user-uuid',
        review: { reviewStatus: 'rejected' },
      });

      expect(result).toEqual({ status: 'ignored' });
      expect(userRepo.update).not.toHaveBeenCalled();
    });

    it('atualiza kyc_profiles existente sem duplicar', async () => {
      const existing = { id: 'profile-uuid', verifiedAt: null };
      userRepo.findOne.mockResolvedValue(mockUser());
      kycProfileRepo.findOne.mockResolvedValue(existing);

      await service.processKycWebhook({
        externalUserId: 'user-uuid',
        review: { reviewStatus: 'approved' },
        applicant: { id: 'sumsub-app-id' },
      });

      expect(kycProfileRepo.update).toHaveBeenCalledWith(
        'profile-uuid',
        expect.objectContaining({
          status: 'approved',
          providerId: 'sumsub-app-id',
        }),
      );
      expect(kycProfileRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('test_ws_notification', () => {
    it('emite kyc_status_updated via gateway após aprovação', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      kycProfileRepo.findOne.mockResolvedValue(null);
      kycProfileRepo.save.mockResolvedValue({});

      await service.processKycWebhook({
        externalUserId: 'user-uuid',
        review: { reviewStatus: 'approved' },
        applicant: { id: 'sumsub-app-id' },
      });

      expect(mockGateway.emitKycStatusUpdated).toHaveBeenCalledWith(
        'user-uuid',
        expect.objectContaining({ status: 'verified' }),
      );
    });

    it('não emite WS quando webhook é ignorado', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await service.processKycWebhook({
        externalUserId: 'nao-existe',
        review: { reviewStatus: 'approved' },
      });

      expect(mockGateway.emitKycStatusUpdated).not.toHaveBeenCalled();
    });
  });
});
