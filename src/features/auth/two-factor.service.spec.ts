import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorService } from './two-factor.service';
import { generateSync } from 'otplib';

describe('TwoFactorService', () => {
  let service: TwoFactorService;
  const mockEncryptionKey =
    '678c2e783451e04132890567a98b0c1234567890abcdef0123456789abcdef01';

  beforeEach(async () => {
    process.env.ENCRYPTION_KEY = mockEncryptionKey;

    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFactorService],
    }).compile();

    service = module.get<TwoFactorService>(TwoFactorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('TOTP Logic', () => {
    it('should generate a valid secret', () => {
      const secret = service.generateSecret();
      expect(secret).toBeDefined();
      expect(typeof secret).toBe('string');
      expect(secret.length).toBeGreaterThanOrEqual(16);
    });

    it('should generate a QR code data URI', async () => {
      const secret = service.generateSecret();
      const qrCode = await service.generateQrCode('test@user.com', secret);
      expect(qrCode).toContain('data:image/png;base64,');
    });

    it('should verify a valid token', () => {
      const secret = service.generateSecret();
      const token = generateSync({ secret });
      const isValid = service.verifyToken(secret, token);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid token', () => {
      const secret = service.generateSecret();
      const isValid = service.verifyToken(secret, '000000');
      expect(isValid).toBe(false);
    });

    it('should verify token with a small time offset (within 30s window)', () => {
      const secret = service.generateSecret();
      const realNow = Date.now;
      const baseTime = 120000; // exactly at a 30s step boundary

      global.Date.now = jest.fn(() => baseTime);
      const token = generateSync({ secret });
      
      const twentySecondsLater = baseTime + 20000;
      global.Date.now = jest.fn(() => twentySecondsLater);
      const isValid = service.verifyToken(secret, token);
      
      expect(isValid).toBe(true);
      global.Date.now = realNow;
    });

    it('should reject token with large time offset (outside 30s window)', () => {
      const secret = service.generateSecret();
      const realNow = Date.now;
      const baseTime = 120000;

      global.Date.now = jest.fn(() => baseTime);
      const token = generateSync({ secret });
      
      const twoMinutesLater = baseTime + 120000;
      global.Date.now = jest.fn(() => twoMinutesLater);
      const isValid = service.verifyToken(secret, token);
      
      expect(isValid).toBe(false);
      global.Date.now = realNow;
    });
  });

  describe('Encryption', () => {
    it('should encrypt and decrypt a secret correctly', () => {
      const secret = 'JBSWY3DPEHPK3PXP'; // Example Base32 secret
      const encrypted = service.encryptSecret(secret);
      
      expect(encrypted).not.toBe(secret);
      expect(encrypted.split(':').length).toBe(3); // iv:authTag:content
      
      const decrypted = service.decryptSecret(encrypted);
      expect(decrypted).toBe(secret);
    });

    it('should produce different ciphertexts for the same secret (due to IV)', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const enc1 = service.encryptSecret(secret);
      const enc2 = service.encryptSecret(secret);
      
      expect(enc1).not.toBe(enc2);
    });

    it('should throw error if decryption fails or format is invalid', () => {
      expect(() => service.decryptSecret('invalid:format')).toThrow();
      expect(() => service.decryptSecret('a:b:c')).toThrow();
    });
  });
});
