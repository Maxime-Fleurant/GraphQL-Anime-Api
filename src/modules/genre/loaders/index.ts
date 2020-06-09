import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import DataLoader from 'dataloader';
import _ from 'lodash';
import { Genre } from '../genre.type';
import { Anime } from '../../anime/anime.type';

@Service()
export class GenreLoader {
  constructor(@InjectRepository(Genre) private genreRepo: Repository<Genre>) {}

  batchAnimeByGenre: (keys: readonly number[]) => Promise<Anime[][]> = async (keys) => {
    const genres = await this.genreRepo
      .createQueryBuilder('genre')
      .leftJoinAndSelect('genre.animes', 'animes')
      .where('genre.id in (:...genreIds)', { genreIds: keys })
      .getMany();

    const formatAnime = keys.map((key) => {
      const keyGenre = genres.find((genre) => {
        return genre.id === key;
      });

      return keyGenre ? keyGenre.animes : [];
    });

    return formatAnime;
  };

  createLoaders = () => {
    return {
      batchAnimeByGenre: new DataLoader<number, Anime[]>((keys) => this.batchAnimeByGenre(keys)),
    };
  };
}
