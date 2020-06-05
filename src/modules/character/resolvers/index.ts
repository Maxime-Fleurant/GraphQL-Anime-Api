import { Resolver, Arg, FieldResolver, Root, Mutation } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Character } from '../character.type';
import { Anime } from '../../anime/anime.type';
import { CharacterInput, UpdateCharacterInput } from './types/character-input';
import { createGenericResolver } from '../../../common/GenericResolver';

@Resolver(() => Character)
export class CharacterResolver extends createGenericResolver('Character', Character) {
  constructor(
    @InjectRepository(Anime) private animeRepository: Repository<Anime>,
    @InjectRepository(Character) private characterRepository: Repository<Character>
  ) {
    super();
  }

  @FieldResolver()
  async anime(@Root() parent: Character): Promise<Anime | undefined> {
    const anime = await this.animeRepository.findOne(parent.animeId);

    return anime;
  }

  @Mutation(() => Character)
  async createCharacter(@Arg('characterData') characterData: CharacterInput): Promise<Character> {
    const { animeId, ...formatedCharacterData } = {
      ...characterData,
      anime: { id: characterData.animeId },
    };

    const newCharacter = this.characterRepository.save(
      this.characterRepository.create(formatedCharacterData)
    );

    return newCharacter;
  }

  @Mutation(() => Character)
  async updateCharacter(
    @Arg('characterId') characterId: number,
    @Arg('characterData') characterData: UpdateCharacterInput
  ): Promise<Character | undefined> {
    await this.characterRepository.update(characterId, characterData);

    const updatedCharacter = await this.characterRepository.findOne(characterId);

    return updatedCharacter;
  }
}
