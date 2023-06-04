import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReqUser } from 'src/common';

import type { Payload } from './auth.interface';
import { AuthService } from './auth.service';
import { LoggedUserOutput, LoginUserInput } from './dto';
import { RefreshJwtInput } from './dto/refresh-jwt.input';
import { InvalidCredentialsException, InvalidTokenException } from './exceptions';
import { JwtVerifyGuard } from './guards';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => LoggedUserOutput)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput): Promise<LoggedUserOutput> {
    const user = await this.auth.validateUser(loginUserInput.email, loginUserInput.password);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    return this.auth.jwtSign(user as Payload);
  }

  @Mutation(() => LoggedUserOutput)
  @UseGuards(JwtVerifyGuard)
  jwtRefresh(@ReqUser() user: Payload, @Args('refreshJwtInput') refreshJwtInput: RefreshJwtInput): LoggedUserOutput {
    if (!refreshJwtInput.refresh_token || !this.auth.validateRefreshToken(user, refreshJwtInput.refresh_token)) {
      throw new InvalidTokenException();
    }

    return this.auth.jwtSign(user);
  }
}
