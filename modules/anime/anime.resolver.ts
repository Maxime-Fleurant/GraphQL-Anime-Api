import { Resolver, Query, Arg, FieldResolver, Root, Mutation, Args } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Anime } from './anime.type';
import { Character } from '../character/character.type';
import { Studio } from '../studio/studio.type';
import { Genre } from '../genre/genre.type';
import { AnimeInput, UpdateAnimeInput } from './types/anime-input';
import { BaseCharacterInput } from '../character/types/character-input';

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(
    @InjectRepository(Anime) private animeRepository: Repository<Anime>,
    @InjectRepository(Character) private characterRepository: Repository<Character>,
    @InjectRepository(Studio) private studioRepository: Repository<Studio>
  ) {}

  @Query(() => [Anime])
  async animes(): Promise<Anime[]> {
    const animes = await this.animeRepository.find();

    return animes;
  }

  @Query(() => Anime)
  async anime(@Arg('id') id: string): Promise<Anime | undefined> {
    const anime = await this.animeRepository.findOne(id);

    return anime;
  }

  @FieldResolver()
  async characters(@Root() parent: Anime): Promise<Character[]> {
    const characters = await this.characterRepository.find({ where: { anime: parent.id } });

    return characters;
  }

  @FieldResolver()
  async studio(@Root() parent: Anime): Promise<Studio | undefined> {
    const studio = await this.studioRepository.findOne(parent.studioId);

    return studio;
  }

  @FieldResolver()
  async genres(@Root() parent: Anime): Promise<Genre[]> {
    const genres = await this.animeRepository
      .createQueryBuilder()
      .relation(Anime, 'genres')
      .of(parent.id)
      .loadMany();

    return genres;
  }

  @Mutation(() => Anime)
  async createAnime(
    @Arg('animeData') { title, desciption, studioId, genreIds }: AnimeInput,
    @Arg('charactersData', () => [BaseCharacterInput], { nullable: true })
    charactersData?: BaseCharacterInput[]
  ): Promise<Anime> {
    const genreMap = genreIds.map((genreId) => {
      return { id: genreId };
    });

    const newAnime = this.animeRepository.create({
      title,
      desciption,
      studio: { id: studioId },
      genres: genreMap,
      characters: charactersData,
    });

    return this.animeRepository.save(newAnime);
  }

  @Mutation(() => Anime)
  async addGenreFromAnime(
    @Arg('animeId') animeId: number,
    @Arg('genreIds', () => [Number]) genreIds: number[]
  ): Promise<Anime | undefined> {
    await this.animeRepository
      .createQueryBuilder()
      .relation(Anime, 'genres')
      .of(animeId)
      .add(genreIds);

    return this.animeRepository.findOne(animeId);
  }

  @Mutation(() => Anime)
  async removeGenreFromAnime(
    @Arg('animeId') animeId: number,
    @Arg('genreIds', () => [Number]) genreIds: number[]
  ): Promise<Anime | undefined> {
    await this.animeRepository
      .createQueryBuilder()
      .relation(Anime, 'genres')
      .of(animeId)
      .remove(genreIds);

    return this.animeRepository.findOne(animeId);
  }

  @Mutation(() => Anime)
  async updateAnime(
    @Arg('animeId') animeId: number,
    @Arg('updateData') updateData: UpdateAnimeInput
  ): Promise<Anime | undefined> {
    const { studioId, ...formatedUpdateData } = {
      ...updateData,
      studio: updateData.studioId ? { id: updateData.studioId } : undefined,
    };

    await this.animeRepository.update(animeId, formatedUpdateData);

    const anime = await this.animeRepository.findOne(animeId);

    return anime;
  }

  @Mutation(() => String)
  async deleteAnime(@Arg('animeId') animeId: number): Promise<string> {
    await this.animeRepository.delete(animeId);

    return 'deleted';
  }
}
