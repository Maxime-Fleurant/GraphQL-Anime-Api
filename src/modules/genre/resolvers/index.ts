import { Resolver, FieldResolver, Root, Ctx } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { Genre } from '../genre.type';
import { Anime } from '../../anime/anime.type';
import { createGenericResolver } from '../../../common/GenericResolver';
import { IContext } from '../../../common/types/IContext';

@Resolver(() => Genre)
export class GenreResolver extends createGenericResolver('Genre', Genre) {
  constructor(@InjectRepository(Genre) private genreRepository: Repository<Genre>) {
    super();
  }

  @FieldResolver()
  async animes(@Root() parent: Genre, @Ctx() context: IContext): Promise<Anime[] | undefined> {
    const animes = await context.loaders.genreLoaders.batchAnimeByGenre.load(parent.id);

    return animes;
  }
}
