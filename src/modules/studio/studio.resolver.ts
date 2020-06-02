import { Resolver, Query, Arg, FieldResolver, Root, Mutation } from 'type-graphql';
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
  async studio(@Arg('id') id: string): Promise<Studio | undefined> {
    return this.studioRepository.findOne(id);
  }

  @FieldResolver()
  async animes(@Root() parent: Studio): Promise<Anime[]> {
    const animes = await this.animeRepository.find({ where: { studio: parent.id } });

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

  @Mutation(() => String)
  async deleteStudio(@Arg('studioId') studioId: number): Promise<string> {
    await this.studioRepository.delete(studioId);

    return 'deleted';
  }
}
