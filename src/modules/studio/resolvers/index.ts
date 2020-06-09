import { Resolver, Arg, FieldResolver, Root, Mutation, Ctx } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Anime } from '../../anime/anime.type';
import { Studio } from '../studio.type';
import { createGenericResolver } from '../../../common/GenericResolver';
import { IContext } from '../../../app';

@Resolver(() => Studio)
export class StudioResolver extends createGenericResolver('Studio', Studio) {
  constructor(
    @InjectRepository(Anime) private animeRepository: Repository<Anime>,
    @InjectRepository(Studio) private studioRepository: Repository<Studio>
  ) {
    super();
  }

  @FieldResolver()
  async animes(@Root() parent: Studio, @Ctx() context: IContext): Promise<Anime[]> {
    const animes = await context.loaders.studioLoaders.batchFindAnimesByStudioIds.load(parent.id);

    return animes;
  }

  @Mutation(() => Studio)
  async createStudio(@Arg('studioName') studioName: string): Promise<Studio> {
    const newStudio = this.studioRepository.save(
      this.studioRepository.create({ name: studioName })
    );

    return newStudio;
  }

  @Mutation(() => Studio)
  async updateStudio(
    @Arg('studioId') studioID: number,
    @Arg('studioName') studioName: string
  ): Promise<Studio | undefined> {
    await this.studioRepository.update(studioID, { name: studioName });

    const updatedStudio = await this.studioRepository.findOne(studioID);

    return updatedStudio;
  }
}
