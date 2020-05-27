import { Resolver, Query, Arg, FieldResolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Anime } from '../anime/anime.type';
import { Studio } from './studio.type';

@Resolver(() => Studio)
export class StudioResolver {
  constructor(
    @InjectRepository(Anime) private animeRepository: Repository<Anime>,
    @InjectRepository(Studio) private studioRepository: Repository<Studio>
  ) {}

  @Query(() => [Studio])
  async studios(): Promise<Studio[]> {
    return this.studioRepository.find();
  }

  @Query(() => Studio)
  async studio(@Arg('id') id: string): Promise<Studio> {
    return this.studioRepository.findOne(id);
  }

  @FieldResolver()
  async animes(@Root() parent: Studio): Promise<Anime[]> {
    const animes = await this.animeRepository.find({ where: { studio: parent.id } });

    return animes;
  }
}
