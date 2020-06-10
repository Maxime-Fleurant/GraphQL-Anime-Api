import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LoginResult {
  @Field({ nullable: true })
  token: string;
}
