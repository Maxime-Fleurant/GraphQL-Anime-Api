import { InputType, Field } from 'type-graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class BaseCharacterInput {
  @Field()
  name: string;

  @Field()
  @MaxLength(50)
  description: string;
}

@InputType()
export class CharacterInput extends BaseCharacterInput {
  @Field()
  animeId: number;
}

@InputType()
export class UpdateCharacterInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  description?: string;
}
