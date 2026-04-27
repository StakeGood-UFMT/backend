import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateSecret, verifySync, generateURI } from 'otplib';
import * as qrcode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class TwoFactorService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length !== 64) {
      throw new InternalServerErrorException(
        'ENCRYPTION_KEY must be a 64-character hex string (32 bytes)',
      );
    }
    this.key = Buffer.from(encryptionKey, 'hex');
  }

  /**
   * Generates a new TOTP secret.
   */
  generateSecret(): string {
    return generateSecret({ length: 20 });
  }

  /**
   * Generates a QR Code Data URI for the given secret.
   */
  async generateQrCode(userIdentifier: string, secret: string): Promise<string> {
    const otpauth = generateURI({
      secret,
      label: userIdentifier,
      issuer: 'StakeGood',
    });
    try {
      return await qrcode.toDataURL(otpauth);
    } catch (err) {
      throw new InternalServerErrorException('Failed to generate QR code');
    }
  }

  /**
   * Verifies a TOTP token against a secret.
   */
  verifyToken(secret: string, token: string): boolean {
    try {
      return verifySync({ token, secret }).valid;
    } catch (err) {
      return false;
    }
  }

  /**
   * Encrypts the TOTP secret for storage.
   * Format: iv:authTag:encryptedSecret
   */
  encryptSecret(secret: string): string {
    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      let encrypted = cipher.update(secret, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (err) {
      throw new InternalServerErrorException('Failed to encrypt secret');
    }
  }

  /**
   * Decrypts the stored TOTP secret.
   */
  decryptSecret(encryptedData: string): string {
    try {
      const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
      if (!ivHex || !authTagHex || !encrypted) {
        throw new Error('Invalid encrypted data format');
      }
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err) {
      throw new InternalServerErrorException('Failed to decrypt secret');
    }
  }
}
