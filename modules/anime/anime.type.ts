import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Studio } from '../studio/studio.type';
import { Genre } from '../genre/genre.type';
import { Character } from '../character/character.type';

@ObjectType()
@Entity()
export class Anime extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column()
  title: string;

  @ManyToOne(() => Studio, (studio) => studio.animes)
  studio: Studio;

  @OneToMany(() => Character, (character) => character.anime)
  characters: Character[];

  @ManyToMany(() => Genre, (genre) => genre.animes)
  @JoinTable()
  genres: Genre[];
}
