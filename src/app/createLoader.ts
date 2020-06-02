import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CharacterRepository } from '../modules/character/character.repository';

@Service()
export class Loader {
  constructor(
    @InjectRepository(CharacterRepository) private characterCustomRepo: CharacterRepository,
    @Inject('test') DataLoaderCreator: any
  ) {
    console.log(DataLoaderCreator);
  }
}
