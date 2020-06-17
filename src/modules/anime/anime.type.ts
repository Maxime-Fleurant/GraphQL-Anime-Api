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
import { ObjectType, Field, ID, InputType } from 'type-graphql';
import { Studio } from '../studio/studio.type';
import { Genre } from '../genre/genre.type';
import { Character } from '../character/character.type';
import { Review } from '../reviews/reviews.type';
import { Tag } from '../tag/tag.type';

@ObjectType()
@Entity()
export class Anime extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  englishTitle?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  romajiTitle?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nativeTitle?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  desciption?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerImage?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  xLargeCoverImage?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  largeCoverImage?: string;

  @Field()
  @Column()
  trailer: string;

  @Field()
  @Column()
  popularity: number;

  @Field(() => Studio)
  @ManyToOne(() => Studio, (studio) => studio.animes, { onDelete: 'SET NULL', nullable: false })
  studio: Studio;

  @RelationId((anime: Anime) => anime.studio)
  studioId: number;

  @Field(() => [Character], { nullable: 'items' })
  @OneToMany(() => Character, (character) => character.anime, { cascade: true })
  characters: Character[];

  @Field(() => [Review], { nullable: 'items' })
  @OneToMany(() => Review, (review) => review.anime, { cascade: true })
  reviews: Review[];

  @Field(() => [Genre], { nullable: 'items' })
  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];

  @Field(() => [Tag], { nullable: 'items' })
  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}

@InputType()
export class BaseAnimeInput {
  @Field({ nullable: true })
  englishTitle?: string;

  @Field({ nullable: true })
  romajiTitle?: string;

  @Field({ nullable: true })
  nativeTitle?: string;

  @Field({ nullable: true })
  desciption?: string;

  @Field({ nullable: true })
  bannerImage?: string;

  @Field({ nullable: true })
  xLargeCoverImage?: string;

  @Field({ nullable: true })
  largeCoverImage?: string;

  @Field()
  trailer: string;

  @Field()
  popularity: number;

  @Field()
  studioId: number;

  @Field(() => [Number])
  genreIds: number[];

  @Field(() => [Number])
  tagIds: number[];
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
