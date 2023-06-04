import { ObjectType } from '@nestjs/graphql';
import { RelayTypes } from 'src/common';

import { User } from '../entities';

@ObjectType()
export class UsersResponse extends RelayTypes<User>(User) {}
