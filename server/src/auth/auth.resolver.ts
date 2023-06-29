import { UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReqUser } from 'src/common';
import { CreateUserInput } from 'src/shared/user';

import type { Payload } from './auth.interface';
import { AuthService } from './auth.service';
import { LoggedUserOutput, LoginUserInput, VerifyMailInput } from './dto';
import { RefreshJwtInput } from './dto/refresh-jwt.input';
import { UserRegisteredEvent } from './events';
import { InvalidCredentialsException, InvalidTokenException } from './exceptions';
import { JwtVerifyGuard } from './guards';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService, private readonly events: EventEmitter2) {}

  @Mutation(() => LoggedUserOutput)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput): Promise<LoggedUserOutput> {
    const user = await this.auth.validateUser(loginUserInput.email, loginUserInput.password);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    return this.auth.jwtSign(user as Payload);
  }

  @Mutation(() => LoggedUserOutput)
  async register(@Args('createUserInput') createUserInput: CreateUserInput): Promise<LoggedUserOutput> {
    const user = await this.auth.register(createUserInput);

    this.events.emit(UserRegisteredEvent.name, new UserRegisteredEvent(user, this.auth.signMail(user.email)));

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

  @Mutation(() => Boolean)
  async verifyMail(@Args('verifyMailInput') verifyMailInput: VerifyMailInput): Promise<boolean> {
    return this.auth.verifyMail(verifyMailInput.token);
  }
}
