import { Resolver, Query, ClassType, Arg, Mutation, Authorized } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

export function createGenericResolver<T extends ClassType>(suffix: string, objectTypeCls: T) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @InjectRepository(objectTypeCls) private genericRepo: Repository<T>;

    @Query(() => [objectTypeCls], { name: `${suffix}s` })
    async getAll(): Promise<T[] | undefined> {
      return this.genericRepo.find();
    }

    @Query(() => objectTypeCls, { name: `${suffix}` })
    async getOne(@Arg('id') id: string): Promise<T | undefined> {
      return this.genericRepo.findOne(id);
    }

    @Authorized(['admin'])
    @Mutation(() => String, { name: `delete${suffix}` })
    async delete(@Arg('id') id: string): Promise<string> {
      await this.genericRepo.delete(id);

      return 'deleted';
    }
  }

  return BaseResolver;
}
