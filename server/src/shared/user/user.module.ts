import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth';
import { DashboardModule } from 'src/dashboard';

import { User, UserSchema } from './entities';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => AuthModule), DashboardModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
