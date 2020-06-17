import { Resolver, Arg, FieldResolver, Root, Mutation, Ctx, Authorized } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { Anime, UpdateAnimeInput, BaseAnimeInput } from '../anime.type';
import { Character } from '../../character/character.type';
import { Studio } from '../../studio/studio.type';
import { Genre } from '../../genre/genre.type';

import { BaseCharacterInput } from '../../character/resolvers/types/character-input';
import { createGenericResolver } from '../../../common/GenericResolver';
import { IContext } from '../../../common/types/IContext';
import { Review } from '../../reviews/reviews.type';

@Resolver(() => Anime)
export class AnimeResolver extends createGenericResolver('Anime', Anime) {
  constructor(@InjectRepository(Anime) private animeRepository: Repository<Anime>) {
    super();
  }

  @FieldResolver()
  async characters(@Root() parent: Anime, @Ctx() context: IContext): Promise<Character[]> {
    const result = await context.loaders.characterLoaders.batchFindbyAnime.load(parent.id);

    return result;
  }

  @FieldResolver()
  async studio(@Root() parent: Anime, @Ctx() context: IContext): Promise<Studio | undefined> {
    const studio = await context.loaders.studioLoaders.batchFindById.load(parent.studioId);

    return studio;
  }

  @FieldResolver()
  async genres(@Root() parent: Anime, @Ctx() context: IContext): Promise<Genre[]> {
    const genres = await context.loaders.animeLoaders.batchGenreByAnimeIds.load(parent.id);

    return genres;
  }

  @FieldResolver()
  async reviews(@Root() parent: Anime, @Ctx() context: IContext): Promise<Review[]> {
    const result = await context.loaders.reviewLoaders.batchFindByAnime.load(parent.id);

    return result;
  }

  @FieldResolver()
  async tags(@Root() parent: Anime, @Ctx() context: IContext): Promise<Genre[] | undefined> {
    const genres = await context.loaders.animeLoaders.batchGenreByAnimeIds.load(parent.id);

    return genres;
  }

  @Authorized(['admin'])
  @Mutation(() => Anime)
  async createAnime(
    @Arg('animeData')
    {
      englishTitle,
      romajiTitle,
      nativeTitle,
      desciption,
      bannerImage,
      xLargeCoverImage,
      largeCoverImage,
      trailer,
      popularity,
      studioId,
      genreIds,
      tagIds,
    }: BaseAnimeInput,
    @Arg('charactersData', () => [BaseCharacterInput], { nullable: true })
    charactersData?: BaseCharacterInput[]
  ): Promise<Anime> {
    const genreMap = genreIds.map((genreId) => {
      return { id: genreId };
    });

    const newAnime = this.animeRepository.create({
      englishTitle,
      romajiTitle,
      nativeTitle,
      desciption,
      studio: { id: studioId },
      genres: genreMap,
      characters: charactersData,
    });

    return this.animeRepository.save(newAnime);
  }

  @Authorized(['admin'])
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

  @Authorized(['admin'])
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
}
