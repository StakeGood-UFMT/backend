import * as crypto from 'crypto';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HmacWebhookGuard } from './hmac-webhook.guard';

const SECRET = 'test-secret';

const buildContext = (overrides: {
  signature?: string;
  rawBody?: Buffer;
  secret?: string | undefined;
}): ExecutionContext => {
  const req = {
    headers: { 'x-sumsub-signature': overrides.signature },
    rawBody: overrides.rawBody,
  };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
};

const sign = (body: Buffer, secret = SECRET) =>
  crypto.createHmac('sha256', secret).update(body).digest('hex');

describe('test_webhook_hmac_ok – HmacWebhookGuard', () => {
  let guard: HmacWebhookGuard;

  beforeEach(() => {
    const config = { get: jest.fn().mockReturnValue(SECRET) } as unknown as ConfigService;
    guard = new HmacWebhookGuard(config);
  });

  it('permite requisição com assinatura correta', () => {
    const body = Buffer.from(JSON.stringify({ externalUserId: 'u1' }));
    const ctx = buildContext({ signature: sign(body), rawBody: body });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('rejeita requisição com assinatura incorreta', () => {
    const body = Buffer.from('{"externalUserId":"u1"}');
    const ctx = buildContext({ signature: 'assinatura-errada-hex-00000000000000000000000000000000000000000000000000000000000000', rawBody: body });
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('rejeita quando header está ausente', () => {
    const body = Buffer.from('{}');
    const ctx = buildContext({ signature: undefined, rawBody: body });
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('rejeita quando rawBody está ausente', () => {
    const ctx = buildContext({ signature: sign(Buffer.from('{}')), rawBody: undefined });
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('rejeita quando SUMSUB_WEBHOOK_SECRET não está configurado', () => {
    const config = { get: jest.fn().mockReturnValue(undefined) } as unknown as ConfigService;
    const guardNoSecret = new HmacWebhookGuard(config);
    const body = Buffer.from('{}');
    const ctx = buildContext({ signature: sign(body), rawBody: body });
    expect(() => guardNoSecret.canActivate(ctx)).toThrow(UnauthorizedException);
  });
});
