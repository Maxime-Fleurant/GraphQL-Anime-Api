import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import DataLoader from 'dataloader';
import _ from 'lodash';
import { Anime } from '../anime.type';

@Service()
export class AnimeLoaders {
  constructor(@InjectRepository(Anime) private studioRepo: Repository<Anime>) {}

  batchFindGenreFromAnimeIds: (keys: readonly number[]) => Promise<number[]> = async (keys) => {
    console.log('fdlk');
    const studios = await this.studioRepo
      .createQueryBuilder('genre')
      .where('genre.animes in (:...animeIds)', { animeIds: keys })
      .getMany();
    console.log(studios);
    // const formatedStudios = keys.map((key) =>
    //   studios.find((studio) => {
    //     return studio.id === key;
    //   })
    // );

    return [1];
  };

  createLoaders = () => {
    return {
      batchFindGenreFromAnimeIds: new DataLoader<number, number>((keys) =>
        this.batchFindGenreFromAnimeIds(keys)
      ),
    };
  };
}
