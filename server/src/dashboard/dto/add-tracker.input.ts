import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AddTrackerInput {
  @Field(() => String, { description: 'Website url to be tracked' })
  @IsNotEmpty()
  website!: string;
}
