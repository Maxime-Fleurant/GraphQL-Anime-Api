import { ObjectType, Field, ID } from 'type-graphql';
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

  @Field(() => Anime)
  @ManyToOne(() => Anime, (anime) => anime.reviews, { onDelete: 'CASCADE', nullable: false })
  anime: Anime;

  @RelationId((review: Review) => review.anime)
  animeId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'SET NULL' })
  user: User;

  @RelationId((review: Review) => review.user)
  userId: number;
}
