import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, RelationId } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Anime } from '../anime/anime.type';

@ObjectType()
@Entity()
export class Character extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => Anime)
  @ManyToOne(() => Anime, (anime) => anime.characters, { onDelete: 'CASCADE' })
  anime: Anime;

  @RelationId((character: Character) => character.anime)
  animeId: number;
}
