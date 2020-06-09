import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  password: string;
}
