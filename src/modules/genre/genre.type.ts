import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany } from 'typeorm';
import { ID, ObjectType, Field } from 'type-graphql';
import { Anime } from '../anime/anime.type';

@ObjectType()
@Entity()
export class Genre extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Anime, (anime) => anime.genres, { onDelete: 'CASCADE' })
  animes: Anime[];
}
