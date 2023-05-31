import { SetMetadata, CustomDecorator } from '@nestjs/common';
import type { Role } from 'src/shared/user';

export const Roles = (...roles: Role[]): CustomDecorator => SetMetadata('roles', roles);
