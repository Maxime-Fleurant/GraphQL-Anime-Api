import { Resolver, FieldResolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Genre } from '../genre.type';
import { Anime } from '../../anime/anime.type';
import { createGenericResolver } from '../../../common/GenericResolver';

@Resolver(() => Genre)
export class GenreResolver extends createGenericResolver('Genre', Genre) {
  constructor(@InjectRepository(Genre) private genreRepository: Repository<Genre>) {
    super();
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
