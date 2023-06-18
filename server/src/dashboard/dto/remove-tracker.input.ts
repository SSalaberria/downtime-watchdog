import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import type mongoose from 'mongoose';

@InputType()
export class RemoveTrackerInput {
  @Field(() => String, { description: 'ID of tracker to be removed from dashboard' })
  @IsNotEmpty()
  trackerId!: mongoose.Schema.Types.ObjectId;
}
