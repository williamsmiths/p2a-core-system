import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '../../../common/exceptions';

/**
 * Interface cho JWT payload
 */
export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
  isEmailVerified: boolean;
}

/**
 * JWT Strategy - Xác thực JWT token
 * Được sử dụng bởi JwtAuthGuard
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  /**
   * Validate JWT payload và gắn user vào request
   * Method này được Passport tự động gọi sau khi verify token thành công
   */
  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    // Return object này sẽ được gắn vào request.user
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      isEmailVerified: payload.isEmailVerified,
    };
  }
}

