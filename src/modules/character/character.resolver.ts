import { Resolver, Query, Arg, FieldResolver, Root, Mutation } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Character } from './character.type';
import { Anime } from '../anime/anime.type';
import { CharacterInput, UpdateCharacterInput } from './types/character-input';

@Resolver(() => Character)
export class CharacterResolver {
  constructor(
    @InjectRepository(Anime) private animeRepository: Repository<Anime>,
    @InjectRepository(Character) private characterRepository: Repository<Character>
  ) {}

  @Query(() => [Character])
  async characters(): Promise<Character[]> {
    return this.characterRepository.find();
  }

  @Query(() => Character)
  async character(@Arg('id') id: string): Promise<Character | undefined> {
    return this.characterRepository.findOne(id);
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

  @Mutation(() => String)
  async deleteCharacter(@Arg('characterId') characterId: number): Promise<string> {
    await this.characterRepository.delete(characterId);

    return 'deleted';
  }
}
