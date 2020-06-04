import { Resolver, Query, ClassType, Arg } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

export function createGenericResolver<T extends ClassType>(suffix: string, objectTypeCls: T) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @InjectRepository(objectTypeCls) private genericRepo: Repository<T>;

    @Query((type) => [objectTypeCls], { name: `${suffix}s` })
    async getAll(): Promise<T[] | undefined> {
      console.log('generic');
      return this.genericRepo.find();
    }
  }

  return BaseResolver;
}
