import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity()
export class Tag {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;
}
