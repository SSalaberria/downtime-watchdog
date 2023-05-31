import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field(() => String, { description: 'Email' })
  @IsNotEmpty()
  email!: string;

  @Field(() => String, { description: 'Password' })
  @IsNotEmpty()
  password!: string;
}
