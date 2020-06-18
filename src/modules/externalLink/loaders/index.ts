import { Repository } from 'typeorm';
import DataLoader from 'dataloader';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ExternalLink } from '../externalLink.type';

export class ExternalLinkLoaders {
  constructor(@InjectRepository(ExternalLink) private externalLinkRepo: Repository<ExternalLink>) {}

  batchFindByAnimeIds = async (keys: readonly number[]): Promise<ExternalLink[][]> => {
    const externalLinks = await this.externalLinkRepo
      .createQueryBuilder('externalLink')
      .where('externalLink.anime in (:...animeIds)', { animeIds: keys })
      .getMany();

    const formatedExtrnalLinks = keys.map((key) =>
      externalLinks.filter((externalLink) => {
        return externalLink.animeId === key;
      })
    );

    return formatedExtrnalLinks;
  };

  createLoaders = () => {
    return {
      batchGenreByAnimeIds: new DataLoader<number, ExternalLink[]>((keys) =>
        this.batchFindByAnimeIds(keys)
      ),
    };
  };
}
