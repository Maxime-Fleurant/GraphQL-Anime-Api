import { EntityRepository, Repository } from 'typeorm';

import { Character } from './character.type';

@EntityRepository(Character)
export class CharacterRepository extends Repository<Character> {
  batchFindbyAnime = async (keys: readonly unknown[]): Promise<Character[][]> => {
    const characters = await this.createQueryBuilder('character')
      .where('character.anime in (:...animeIds)', { animeIds: keys })
      .getMany();

    const formatedCharacters = keys.map((key) =>
      characters.filter((character) => {
        return character.animeId === key;
      })
    );

    return formatedCharacters;
  };
}
