import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import DataLoader from 'dataloader';
import _ from 'lodash';
import { Studio } from '../studio.type';
import { Anime } from '../../anime/anime.type';

@Service()
export class StudioLoader {
  constructor(@InjectRepository(Studio) private studioRepo: Repository<Studio>) {}

  batchFindById: (keys: readonly number[]) => Promise<(Studio | undefined)[]> = async (keys) => {
    const ids = [...keys];
    const studios = await this.studioRepo.findByIds(ids);

    const formatedStudios = keys.map((key) =>
      studios.find((studio) => {
        return studio.id === key;
      })
    );

    return formatedStudios;
  };

  batchFindAnimesByStudioIds = async (keys: readonly number[]): Promise<Anime[][]> => {
    const studios = await this.studioRepo
      .createQueryBuilder('studio')
      .leftJoinAndSelect('studio.animes', 'animes')
      .where('studio.id in (:...studioIds)', { studioIds: keys })
      .getMany();

    const formatedAnimes = keys.map((key) => {
      const studio = studios.find((oneStudio) => oneStudio.id === key);

      return studio ? studio.animes : [];
    });

    return formatedAnimes;
  };

  createLoaders = () => {
    return {
      batchFindById: new DataLoader<number, Studio | undefined>((keys) => this.batchFindById(keys)),
      batchFindAnimesByStudioIds: new DataLoader<number, Anime[]>((keys) =>
        this.batchFindAnimesByStudioIds(keys)
      ),
    };
  };
}
