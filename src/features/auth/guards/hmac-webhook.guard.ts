import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class HmacWebhookGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const signature = req.headers['x-sumsub-signature'] as string | undefined;
    const rawBody: Buffer | undefined = req.rawBody;
    const secret = this.config.get<string>('SUMSUB_WEBHOOK_SECRET');

    if (!signature || !rawBody || !secret) {
      throw new UnauthorizedException('Missing HMAC signature');
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expected);

    if (
      sigBuffer.length !== expBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expBuffer)
    ) {
      throw new UnauthorizedException('Invalid HMAC signature');
    }

    return true;
  }
}
