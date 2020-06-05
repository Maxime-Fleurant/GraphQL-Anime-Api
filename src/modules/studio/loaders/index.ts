import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import DataLoader from 'dataloader';
import _ from 'lodash';
import { Studio } from '../studio.type';

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

  createLoaders = () => {
    return {
      batchFindById: new DataLoader<number, Studio | undefined>((keys) => this.batchFindById(keys)),
    };
  };
}
