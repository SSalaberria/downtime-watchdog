import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { AuthService } from 'src/auth';
import { DashboardService } from 'src/dashboard';

import type { CreateUserInput } from './dto/create-user.input';
import type { GetUsersInput } from './dto/get-users.input';
import type { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import { UserNotFoundException } from './exceptions';
import type { Role } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private auth: AuthService,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private dashboards: DashboardService,
  ) {}

  public async findOne(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  public async findOneById(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  public async findAll(paginationQuery: GetUsersInput): Promise<User[]> {
    const { limit, offset } = paginationQuery;
    return this.userModel.find().skip(offset).limit(limit).exec();
  }

  public async findAllByRole(role: Role): Promise<User[]> {
    return this.userModel.find({ roles: role }).exec();
  }

  public async getUsers(paginationQuery: GetUsersInput): Promise<{ users: User[]; count: number }> {
    const [users, count] = await Promise.all([this.findAll(paginationQuery), this.userModel.countDocuments()]);

    return { users, count };
  }

  public async update(userId: Types.ObjectId, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userModel.findOneAndUpdate({ _id: userId }, { $set: updateUserInput }, { new: true }).exec();

    if (!user) {
      throw new UserNotFoundException();
    }

    return user.save();
  }

  public async create(createUserInput: CreateUserInput): Promise<User> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const hashedPassword = this.auth.hashPassword(createUserInput.password);

      const newUser = await this.userModel.create({
        ...createUserInput,
        password: hashedPassword,
      });

      await this.dashboards.create({ owner: newUser._id });

      return await newUser.save();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  public async delete(id: Types.ObjectId): Promise<User> {
    const user = await this.findOneById(id);
    await user.deleteOne();

    return user;
  }
}
