import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';

import type { JwtPayload, JwtSign, Payload } from './auth.interface';
import { UserDocument, UserService } from '../shared/user';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, @Inject(forwardRef(() => UserService)) private user: UserService, private config: ConfigService) {}

  public async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.user.findOne(email);

    if (this.comparePassword(password, user.password)) {
      return user;
    }

    return null;
  }

  public validateRefreshToken(data: Payload, refreshToken: string): boolean {
    if (!this.jwt.verify(refreshToken, { secret: this.config.get('jwtRefreshSecret') })) {
      return false;
    }

    const payload = this.jwt.decode(refreshToken) as { sub: string };
    return payload.sub === data.id;
  }

  public jwtSign(data: Payload): JwtSign {
    const payload: JwtPayload = { sub: data.id, name: data.name, roles: data.roles, email: data.email };

    return {
      access_token: this.jwt.sign(payload),
      refresh_token: this.getRefreshToken(payload.sub),
    };
  }

  public hashPassword(password: string): string {
    const salt = this.config.get<string>('auth.salt') || 10;

    return hashSync(password, salt);
  }

  private comparePassword(plainPassword: string, hashedPassword: string): boolean {
    return compareSync(plainPassword, hashedPassword);
  }

  private getRefreshToken(sub: string): string {
    return this.jwt.sign(
      { sub },
      {
        secret: this.config.get('jwtRefreshSecret'),
        expiresIn: '7d', // Set greater than the expiresIn of the access_token
      },
    );
  }
}
