import { buildSchema } from 'type-graphql';
import Container, { Service } from 'typedi';
import path from 'path';

import { AnimeResolver } from '../modules/anime/resolvers';
import { CharacterResolver } from '../modules/character/resolvers';
import { StudioResolver } from '../modules/studio/resolvers';
import { GenreResolver } from '../modules/genre/resolvers';
import { UserResolver } from '../modules/user/resolver';
import { ReviewResolver } from '../modules/reviews/resolvers';
import { customAuthChecker } from './authChecker';

@Service()
export class SchemaMaker {
  async create() {
    const schema = await buildSchema({
      resolvers: [
        AnimeResolver,
        CharacterResolver,
        StudioResolver,
        GenreResolver,
        UserResolver,
        ReviewResolver,
      ],
      container: Container,
      emitSchemaFile: { path: path.resolve(__dirname, '../common/api.graphql') },
      authChecker: customAuthChecker,
    });

    return schema;
  }
}
