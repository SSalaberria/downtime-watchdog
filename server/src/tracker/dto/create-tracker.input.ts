import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTrackerInput {
  @IsNotEmpty()
  @Field(() => String, { description: 'Website to be tracked' })
  website!: string;
}
