import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub?: string;
  userId?: string;
  kyc_status?: string;
  role?: string;
  [key: string]: any;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.jwt]),
      secretOrKey: config.get<string>('JWT_SECRET', 'dev_secret'),
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.sub) throw new UnauthorizedException();
    return {
      wallet: payload.sub,
      userId: payload.userId,
      kycStatus: payload.kyc_status,
      role: payload.role,
    };
  }
}
