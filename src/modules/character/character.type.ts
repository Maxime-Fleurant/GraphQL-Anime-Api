import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, RelationId } from 'typeorm';
import { ObjectType, Field, ID, InputType } from 'type-graphql';
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  nativeName: string;

  @Field()
  @Column()
  largeImg: string;

  @Field()
  @Column()
  mediumImg: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => Anime)
  @ManyToOne(() => Anime, (anime) => anime.characters, { onDelete: 'CASCADE' })
  anime: Anime;

  @RelationId((character: Character) => character.anime)
  animeId: number;
}

@InputType()
export class BaseCharacterInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  largeImg: string;

  @Field()
  mediumImg: string;
}

@InputType()
export class CharacterInput extends BaseCharacterInput {
  @Field()
  animeId: number;
}

@InputType()
export class UpdateCharacterInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
