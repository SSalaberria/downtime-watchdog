import { Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

export class GetUsersInput {
  @IsNotEmpty()
  @Field(() => Number, { description: 'limit' })
  limit!: number;

  @IsNotEmpty()
  @Field(() => Number, { description: 'offset' })
  offset!: number;
}
