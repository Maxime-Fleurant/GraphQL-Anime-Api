import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Anime } from './anime';

@Entity()
export class Character extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Anime, (anime) => anime.characters)
  anime: Anime;
}
