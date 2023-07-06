import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import type { Tracker } from './tracker.entity';
import { Status } from '../tracker.interface';

export type TrackingLogDocument = HydratedDocument<TrackingLog>;

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the tracker',
});

@ObjectType()
@Schema({ timestamps: { createdAt: true } })
export class TrackingLog {
  @Field(() => String, { description: 'Unique identifier of the tracking log' })
  _id!: mongoose.Types.ObjectId;

  @Field(() => Date, { description: 'Date of the tracking log' })
  createdAt!: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Tracker' })
  @Field(() => String, { description: 'Tracker ID' })
  tracker!: Tracker;

  @Prop({ required: true, enum: Object.values(Status) })
  @Field(() => Status, { description: 'Registered status' })
  status!: Status;

  @Prop({ required: false, default: null, type: Number })
  @Field(() => Number, { description: 'Response time', nullable: true })
  responseTime!: number | null;

  @Prop({ required: false, default: null, type: String })
  @Field(() => String, { description: 'Response message', nullable: true })
  response!: string | null;
}

const TrackingLogSchema = SchemaFactory.createForClass(TrackingLog);

export { TrackingLogSchema };
