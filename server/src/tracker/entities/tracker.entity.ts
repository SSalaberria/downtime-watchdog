import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

export type TrackerDocument = HydratedDocument<Tracker>;

@ObjectType()
@Schema({ timestamps: true })
export class Tracker {
  @Field(() => String, { description: 'Unique identifier of the tracker' })
  _id!: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  @Field(() => String, { description: 'Website url to be tracked' })
  website!: string;
}

const TrackerSchema = SchemaFactory.createForClass(Tracker);

export { TrackerSchema };
