import { ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class ExternalLink {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  site: string;

  @Column()
  url: string;
}
