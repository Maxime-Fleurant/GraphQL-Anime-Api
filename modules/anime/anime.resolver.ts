import { Resolver, Query } from 'type-graphql';
import { Anime } from './anime.type';
import { AnimeRepository } from './anime.repository';

@Resolver()
export class AnimeResolver {
  constructor(private AnimeEntity: AnimeRepository) {}

  @Query((returns) => Anime)
  async anime(): Promise<{ id: string }> {
    return { id: '1' };
  }
}
