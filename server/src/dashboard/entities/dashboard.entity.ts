import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/shared/user';
import { Tracker } from 'src/tracker';

export type DashboardDocument = HydratedDocument<Dashboard>;

@Schema({ timestamps: true })
@ObjectType()
export class Dashboard {
  @Field(() => String)
  _id!: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId, unique: true })
  @Field(() => User, { description: 'Owner of dashboard' })
  owner!: mongoose.Schema.Types.ObjectId | User;

  @Prop({ required: true, default: [], type: [mongoose.Schema.Types.ObjectId], ref: 'Tracker' })
  @Field(() => [Tracker], { description: 'Trackers on dashboard' })
  trackers!: mongoose.Schema.Types.ObjectId[];
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
