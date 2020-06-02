import { Injectable } from '@graphql-modules/di';
import { EntityRepository, Repository } from 'typeorm';
import { Anime } from './anime.type';

@Injectable()
@EntityRepository(Anime)
export class AnimeRepository extends Repository<Anime> {}
