import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class VerifyMailInput {
  @Field(() => String)
  @IsNotEmpty()
  token!: string;
}
