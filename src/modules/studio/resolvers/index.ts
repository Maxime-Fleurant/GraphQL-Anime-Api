import { Resolver, Arg, Mutation, Authorized } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Studio } from '../studio.type';
import { createGenericResolver } from '../../../common/GenericResolver';

@Resolver(() => Studio)
export class StudioResolver extends createGenericResolver('Studio', Studio) {
  constructor(@InjectRepository(Studio) private studioRepository: Repository<Studio>) {
    super();
  }

  @Authorized(['admin'])
  @Mutation(() => Studio)
  async createStudio(@Arg('studioName') studioName: string): Promise<Studio> {
    const newStudio = this.studioRepository.save(
      this.studioRepository.create({ name: studioName })
    );

    return newStudio;
  }
}
