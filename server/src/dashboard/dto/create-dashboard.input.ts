import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

@InputType()
export class CreateDashboardInput {
  @IsNotEmpty()
  @Field(() => String, { description: 'Owner of dashboard' })
  owner!: mongoose.Schema.Types.ObjectId;
}
