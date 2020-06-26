import { ObjectType, Field, InputType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { Anime } from '../anime/anime.type';

@ObjectType()
@Entity()
export class ExternalLink {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column()
  site: string;

  @Field()
  @Column()
  url: string;

  @ManyToOne(() => Anime, (anime) => anime.externalLinks, { onDelete: 'CASCADE' })
  anime: Anime;

  @RelationId((externalLink: ExternalLink) => externalLink.anime)
  animeId: number;
}

@InputType()
export class ExternalLinkInput {
  @Field()
  site: string;

  @Field()
  url: string;

  @Field({ nullable: true })
  animeId: number;
}
