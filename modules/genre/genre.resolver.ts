import { Resolver, Query, Arg, FieldResolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Genre } from './genre.type';
import { Anime } from '../anime/anime.type';

@Resolver(() => Genre)
export class GenreResolver {
  constructor(@InjectRepository(Genre) private genreRepository: Repository<Genre>) {}

  @Query(() => [Genre])
  async genres(): Promise<Genre[]> {
    return this.genreRepository.find();
  }

  @Query(() => Genre)
  async genre(@Arg('id') id: string): Promise<Genre> {
    return this.genreRepository.findOne(id);
  }

  @FieldResolver()
  async animes(@Root() parent: Genre): Promise<Anime[]> {
    const animes = await this.genreRepository
      .createQueryBuilder()
      .relation(Genre, 'animes')
      .of(parent.id)
      .loadMany();

    return animes;
  }
}
