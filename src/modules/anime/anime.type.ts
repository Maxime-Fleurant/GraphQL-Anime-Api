import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  RelationId,
} from 'typeorm';
import { ObjectType, Field, ID, Authorized } from 'type-graphql';
import { Studio } from '../studio/studio.type';
import { Genre } from '../genre/genre.type';
import { Character } from '../character/character.type';
import { Review } from '../reviews/reviews.type';

@ObjectType()
@Entity()
export class Anime extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column()
  title: string;

  @Authorized(['admin'])
  @Field()
  @Column({ type: 'text' })
  desciption: string;

  @Field(() => Studio)
  @ManyToOne(() => Studio, (studio) => studio.animes, { onDelete: 'SET NULL', nullable: false })
  studio: Studio;

  @RelationId((anime: Anime) => anime.studio)
  studioId: number;

  @Field(() => [Character])
  @OneToMany(() => Character, (character) => character.anime, { cascade: true })
  characters: Character[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.anime, { cascade: true })
  reviews: Review[];

  @Field(() => [Genre])
  @ManyToMany(() => Genre, (genre) => genre.animes)
  @JoinTable()
  genres: Genre[];
}
