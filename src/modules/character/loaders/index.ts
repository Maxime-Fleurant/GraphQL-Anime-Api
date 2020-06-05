import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import DataLoader from 'dataloader';
import _ from 'lodash';
import { Character } from '../character.type';

@Service()
export class CharacterLoader {
  constructor(@InjectRepository(Character) private characterRepo: Repository<Character>) {}

  batchFindbyAnime: (keys: readonly number[]) => Promise<Character[][]> = async (keys) => {
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
  };

  createLoaders = () => {
    return {
      batchFindbyAnime: new DataLoader<number, Character[]>((keys) => this.batchFindbyAnime(keys)),
    };
  };
}
