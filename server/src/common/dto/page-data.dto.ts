import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageDataDto {
  @Field()
  count!: number;

  @Field()
  limit!: number;

  @Field()
  offset!: number;
}
