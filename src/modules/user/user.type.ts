import { ObjectType, Field, ID, InputType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from '../reviews/reviews.type';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  role: string;

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}

@ObjectType()
export class LoginResult {
  @Field({ nullable: true })
  token: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  password: string;
}
