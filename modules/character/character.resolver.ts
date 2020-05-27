import { Resolver, Query, Arg, FieldResolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Character } from './character.type';
import { Anime } from '../anime/anime.type';

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
  async character(@Arg('id') id: string): Promise<Character> {
    return this.characterRepository.findOne(id);
  }

  @FieldResolver()
  async anime(@Root() parent: Character): Promise<Anime> {
    const anime = await this.animeRepository.findOne(parent.animeId);

    return anime;
  }
}
