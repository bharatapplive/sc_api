// jwt.strategy.ts (NestJS)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // 1. Extract token from Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
    });
  }

  async validate(payload: any) {
    // Return payload so it attaches to req.user
    if (!payload) {
      throw new UnauthorizedException();
    }
    // Ensures req.user contains { userId: ..., sub: ... }
    return { ...payload };
  }
}