import { Resolver, Query, Arg, FieldResolver, Root, Mutation } from 'type-graphql';
import { InjectRepository, InjectConnection } from 'typeorm-typedi-extensions';
import { Repository, Connection, EntityManager } from 'typeorm';
import { Anime } from './anime.type';
import { Character } from '../character/character.type';
import { Studio } from '../studio/studio.type';
import { Genre } from '../genre/genre.type';

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(
    @InjectRepository(Anime) private animeRepository: Repository<Anime>,
    @InjectRepository(Character) private characterRepository: Repository<Character>,
    @InjectRepository(Studio) private studioRepository: Repository<Studio>,
    @InjectConnection() private connection: Connection
  ) {}

  @Query(() => [Anime])
  async animes(): Promise<Anime[]> {
    const animes = await this.animeRepository.find();

    return animes;
  }

  @Query(() => Anime)
  async anime(@Arg('id') id: string): Promise<Anime> {
    const anime = await this.animeRepository.findOne(id);

    return anime;
  }

  @FieldResolver()
  async characters(@Root() parent: Anime): Promise<Character[]> {
    const characters = await this.characterRepository.find({ where: { anime: parent.id } });

    return characters;
  }

  @FieldResolver()
  async studio(@Root() parent: Anime): Promise<Studio> {
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

  @Mutation()
  async createAnime(): Promise<Anime> {
    let newAnime = new Anime();

    this.connection.transaction(async (entityManager: EntityManager) => {
      await entityManager.save(newAnime);
    });

    return 1;
  }
}
