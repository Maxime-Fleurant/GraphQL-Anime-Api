import { Resolver, Root, Ctx, FieldResolver } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { createGenericResolver } from '../../../common/GenericResolver';
import { ExternalLink } from '../externalLink.type';
import { Character } from '../../character/character.type';
import { IContext } from '../../../common/types/IContext';
import { Anime } from '../../anime/anime.type';

@Resolver(() => ExternalLink)
export class ExternalLinkResolver extends createGenericResolver('ExternalLink', ExternalLink) {
  constructor(@InjectRepository(ExternalLink) private externalLinkRepo: Repository<ExternalLink>) {
    super();
  }

  @FieldResolver()
  async anime(@Root() parent: Character, @Ctx() context: IContext): Promise<Anime | undefined> {
    const anime = await context.loaders.animeLoaders.batchFindById.load(parent.animeId);

    return anime;
  }
}
