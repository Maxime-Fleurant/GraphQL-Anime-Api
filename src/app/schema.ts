import { buildSchema, AuthChecker } from 'type-graphql';
import Container, { Service } from 'typedi';
import path from 'path';

import { AnimeResolver } from '../modules/anime/resolvers';
import { CharacterResolver } from '../modules/character/resolvers';
import { StudioResolver } from '../modules/studio/resolvers';
import { UserResolver } from '../modules/user/resolver';
import { ReviewResolver } from '../modules/reviews/resolvers';

import { IContext } from '../common/types/IContext';

@Service()
export class SchemaMaker {
  private customAuthChecker: AuthChecker<IContext> = (
    { root, args, context: { user }, info },
    roles
  ) => {
    if (!user) {
      return false;
    }

    if (roles.length && !roles.includes(user.role)) {
      return false;
    }

    return true;
  };

  async create() {
    const schema = await buildSchema({
      resolvers: [AnimeResolver, CharacterResolver, StudioResolver, UserResolver, ReviewResolver],
      container: Container,
      emitSchemaFile: { path: path.resolve(__dirname, '../common/api.graphql') },
      authChecker: this.customAuthChecker,
    });

    return schema;
  }
}
