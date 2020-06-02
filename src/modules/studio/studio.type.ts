import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Anime } from '../anime/anime.type';

@ObjectType()
@Entity()
export class Studio extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [Anime])
  @OneToMany(() => Anime, (anime) => anime.studio)
  animes: Anime[];
}
