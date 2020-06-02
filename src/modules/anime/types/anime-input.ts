import { InputType, Field } from 'type-graphql';

@InputType()
export class BaseAnimeInput {
  @Field()
  title: string;

  @Field()
  desciption: string;

  @Field()
  studioId: number;
}

@InputType()
export class AnimeInput extends BaseAnimeInput {
  @Field(() => [Number])
  genreIds: number[];
}

@InputType()
export class UpdateAnimeInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  desciption?: string;

  @Field({ nullable: true })
  studioId?: number;
}
