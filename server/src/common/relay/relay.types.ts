/* eslint-disable */
import type { Type } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import * as Relay from 'graphql-relay';

import { PageDataDto as PageData } from '../dto/page-data.dto';

const typeMap = {};
type typeMapType = typeof typeMap;
type keyType = keyof typeMapType;

export function RelayTypes<T>(type: Type<T>): any {
  const { name } = type;

  if (typeMap[`${name}` as keyType]) return typeMap[`${name}` as keyType];

  @ObjectType(`${name}Edge`, { isAbstract: true })
  class Edge implements Relay.Edge<T> {
    public name: string = `${name}Edge`;

    @Field({ nullable: true })
    public cursor!: Relay.ConnectionCursor;

    @Field(() => type, { nullable: true })
    public node!: T;
  }

  @ObjectType(`${name}PageInfo`, { isAbstract: true })
  class PageInfo implements Relay.PageInfo {
    @Field({ nullable: true })
    public startCursor!: Relay.ConnectionCursor;

    @Field({ nullable: true })
    public endCursor!: Relay.ConnectionCursor;

    @Field(() => Boolean)
    public hasPreviousPage!: boolean;

    @Field(() => Boolean)
    public hasNextPage!: boolean;
  }

  @ObjectType(`${name}Connection`, { isAbstract: true })
  class Connection implements Relay.Connection<T> {
    public name = `${name}Connection`;

    @Field(() => [Edge], { nullable: true })
    public edges!: Relay.Edge<T>[];

    @Field(() => PageInfo, { nullable: true })
    public pageInfo!: Relay.PageInfo;
  }

  @ObjectType(`${name}Page`, { isAbstract: true })
  abstract class Page {
    public name: string = `${name}Page`;

    @Field(() => Connection)
    public page!: Connection;

    @Field(() => PageData, { nullable: true })
    public pageData!: PageData;
  }

  typeMap[`${name}` as keyType] = Page as never;

  return typeMap[`${name}` as keyType];
}
