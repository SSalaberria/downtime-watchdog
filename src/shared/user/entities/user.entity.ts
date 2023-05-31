import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument, ObjectId } from 'mongoose';

import type { Role } from '../user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // DAO
@ObjectType() // DTO
export class User {
  @Field(() => String)
  _id!: ObjectId;

  @Prop({ required: true, unique: true })
  @Field(() => String, { description: 'Username' })
  name!: string;

  @Prop({ required: true, default: null, unique: true })
  @Field(() => String, { description: 'Email' })
  email!: string;

  @Prop()
  @HideField()
  password!: string;

  @Prop({ required: false, default: [] })
  @Field(() => [String], { description: 'Roles' })
  roles!: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
