import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RefreshJwtInput {
  @Field(() => String)
  @IsNotEmpty()
  refresh_token!: string;
}
