import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Anime } from '../anime/anime.type';

@Entity()
export class Studio extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Anime, (anime) => anime.studio)
  animes: Anime[];
}
