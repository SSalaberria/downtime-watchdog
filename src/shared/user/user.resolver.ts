import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { connectionFromArraySlice } from 'graphql-relay';
import { JwtAuthGuard, Payload } from 'src/auth';
import { ConnectionArgs, ReqUser, Roles, RolesGuard, getPagingParameters } from 'src/common';

import { CreateUserInput, UpdateUserInput, UsersResponse } from './dto';
import { User } from './entities';
import { Role } from './user.interface';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly users: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.users.create(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(@ReqUser() user: Payload, @Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<User> {
    return this.users.update(user.id, updateUserInput);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findById(@Args('_id', { type: () => String }) id: string): Promise<User> {
    return this.users.findOneById(id);
  }

  @Query(() => UsersResponse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(@Args('args', { type: () => ConnectionArgs }) args: ConnectionArgs): Promise<UsersResponse> {
    const { limit, offset } = getPagingParameters(args);
    const { users, count } = await this.users.getUsers({ limit, offset });

    const page = connectionFromArraySlice(users, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@ReqUser() user: Payload): Promise<User> {
    return this.users.findOneById(user.id);
  }
}
