import { ObjectType, Field, ClassType } from 'type-graphql';

@ObjectType()
export class ErrorType {
  @Field()
  error: string;

  @Field()
  code: number;
}

export function createResultType<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class ResultType {
    @Field(() => TItemClass, { nullable: true })
    data?: TItem;

    @Field(() => ErrorType, { nullable: true })
    error?: ErrorType;
  }
  return ResultType;
}
