import { Resolver, Arg, FieldResolver, Root, Mutation, Ctx, Authorized, Query } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { Anime, UpdateAnimeInput, BaseAnimeInput, SearchAnimeInput } from '../anime.type';
import { Character, BaseCharacterInput } from '../../character/character.type';
import { Studio } from '../../studio/studio.type';
import { Genre } from '../../genre/genre.type';
import { createGenericResolver } from '../../../common/GenericResolver';
import { IContext } from '../../../common/types/IContext';
import { Review } from '../../reviews/reviews.type';
import { Tag } from '../../tag/tag.type';
import { ExternalLink, ExternalLinkInput } from '../../externalLink/externalLink.type';

@Resolver(() => Anime)
export class AnimeResolver extends createGenericResolver('Anime', Anime) {
  constructor(@InjectRepository(Anime) private animeRepository: Repository<Anime>) {
    super();
  }

  @Query(() => [Anime])
  async searchAnime(
    @Arg('searchInput')
    { text, status, format, tagsIn, genresIn, limit, skip = 0 }: SearchAnimeInput
  ): Promise<Anime[]> {
    const searchResultQuery = this.animeRepository
      .createQueryBuilder('anime')
      .leftJoin('anime.tags', 'tag')
      .leftJoin('anime.genres', 'genre');

    if (format) {
      searchResultQuery.andWhere('anime.format = :format', { format });
    }

    if (status) {
      searchResultQuery.andWhere('anime.status = :status', { status });
    }

    if (tagsIn) {
      searchResultQuery.andWhere('tag.name in (:...tagsIn)', { tagsIn });
    }

    if (genresIn) {
      searchResultQuery.andWhere('genre.name in (:...genresIn)', { genresIn });
    }

    if (text) {
      searchResultQuery.andWhere(
        'LOWER(anime.englishTitle) like LOWER(:text) OR LOWER(anime.romajiTitle) like LOWER(:text) OR LOWER(anime.nativeTitle) like LOWER(:text)',
        {
          text: `%${text}%`,
        }
      );
    }
    searchResultQuery.orderBy('anime.popularity', 'DESC').take(limit).skip(skip);

    const searchResult = await searchResultQuery.getMany();

    return searchResult;
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
  async externalLinks(@Root() parent: Anime, @Ctx() context: IContext): Promise<ExternalLink[]> {
    const externalLinks = await context.loaders.externalLinkLoaders.batchGenreByAnimeIds.load(
      parent.id
    );

    return externalLinks;
  }

  @FieldResolver()
  async tags(@Root() parent: Anime, @Ctx() context: IContext): Promise<Tag[]> {
    const tags = await context.loaders.animeLoaders.batchTagsByAnimeIds.load(parent.id);

    return tags;
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
      status,
      format,
      studioId,
      genreIds,
      tagIds,
    }: BaseAnimeInput,
    @Arg('charactersData', () => [BaseCharacterInput], { nullable: true })
    charactersData: BaseCharacterInput[],
    @Arg('externalLinkData', () => [ExternalLinkInput], { nullable: true })
    externalLinkData: ExternalLinkInput[]
  ): Promise<Anime> {
    const genreMap = genreIds
      ? genreIds.map((genreId) => {
          return { id: genreId };
        })
      : [];

    const tagMap = tagIds
      ? tagIds.map((tagId) => {
          return { id: tagId };
        })
      : [];

    const newAnime = this.animeRepository.create({
      englishTitle,
      romajiTitle,
      nativeTitle,
      desciption,
      bannerImage,
      xLargeCoverImage,
      largeCoverImage,
      trailer,
      popularity,
      status,
      format,
      tags: tagMap,
      studio: { id: studioId },
      genres: genreMap,
      characters: charactersData,
      externalLinks: externalLinkData,
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
