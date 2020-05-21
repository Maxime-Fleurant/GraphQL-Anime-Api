import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany } from 'typeorm';
import { Anime } from './anime';

@Entity()
export class Genre extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Anime, (anime) => anime.genres)
  animes: Anime[];
}
