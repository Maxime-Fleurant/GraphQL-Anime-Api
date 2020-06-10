import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateReviewInput {
  @Field()
  summary: string;

  @Field()
  body: string;

  @Field()
  score: number;

  @Field()
  animeId: number;

  @Field()
  userId: number;
}
