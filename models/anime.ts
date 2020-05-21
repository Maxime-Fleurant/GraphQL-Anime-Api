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
import { Studio } from './studio';
import { Character } from './character';
import { Genre } from './genre';

@ObjectType()
@Entity()
export class Anime extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column()
  title: string;

  @Field((type) => Studio)
  @ManyToOne(() => Studio, (studio) => studio.animes)
  studio: Studio;

  @Field((type) => [Character])
  @OneToMany(() => Character, (character) => character.anime)
  characters: Character[];

  @Field((type) => [Genre])
  @ManyToMany(() => Genre, (genre) => genre.animes)
  @JoinTable()
  genres: Genre[];
}
