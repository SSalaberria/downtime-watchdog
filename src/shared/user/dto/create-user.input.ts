import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: "User's name" })
  @IsNotEmpty()
  name!: string;

  @Field(() => String, { description: "User's password" })
  @IsNotEmpty()
  password!: string;

  @Field(() => String, { description: "User's email" })
  @IsNotEmpty()
  email!: string;
}
