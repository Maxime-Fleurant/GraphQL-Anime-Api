import { Resolver } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { createGenericResolver } from '../../../common/GenericResolver';
import { ExternalLink } from '../externalLink.type';

@Resolver(() => ExternalLink)
export class ExternalLinkResolver extends createGenericResolver('ExternalLink', ExternalLink) {
  constructor(@InjectRepository(ExternalLink) private externalLinkRepo: Repository<ExternalLink>) {
    super();
  }
}
