import { ObjectType, Field, ID, InputType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { Anime } from '../anime/anime.type';
import { User } from '../user/user.type';

@ObjectType()
@Entity()
export class Review {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column({ type: 'text' })
  summary: string;

  @Field()
  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'int' })
  score: number;

  @ManyToOne(() => Anime, (anime) => anime.reviews, { onDelete: 'CASCADE', nullable: false })
  anime: Anime;

  @Field(() => ID)
  @RelationId((review: Review) => review.anime)
  animeId: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'SET NULL' })
  user: User;

  @RelationId((review: Review) => review.user)
  userId: number;
}

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

@InputType()
export class UpdateReviewInput {
  @Field({ nullable: true })
  summary?: string;

  @Field({ nullable: true })
  body?: string;

  @Field({ nullable: true })
  score?: number;
}
