import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';

import { Character } from '../character.type';
import { CreateSingleLoader } from '../../../common/createSingleLoader';

@Service()
export class CharacterLoader {
  constructor(
    @InjectRepository(Character) private characterRepo: Repository<Character>,
    private loaderUtil: CreateSingleLoader
  ) {}

  async batchFindbyAnime(keys: readonly unknown[]): Promise<Character[][]> {
    const characters = await this.characterRepo
      .createQueryBuilder('character')
      .where('character.anime in (:...animeIds)', { animeIds: keys })
      .getMany();
    const formatedCharacters = keys.map((key) =>
      characters.filter((character) => {
        return character.animeId === key;
      })
    );
    return formatedCharacters;
  }

  createLoaders() {
    return {
      batchFindbyAnime: this.loaderUtil.create(this.batchFindbyAnime),
    };
  }
}
