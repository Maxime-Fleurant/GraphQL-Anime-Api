import { GraphQLModule } from '@graphql-modules/core';
import { buildSchemaSync } from 'type-graphql';
import { getCustomRepository } from 'typeorm';
import { AnimeResolver } from './anime.resolver';
import { AnimeRepository } from './anime.repository';

export const AnimeModule = new GraphQLModule({
  providers: [AnimeResolver, AnimeRepository],
  extraSchemas: [
    buildSchemaSync({
      resolvers: [AnimeResolver],
      container: ({ context }) => AnimeModule.injector.getSessionInjector(context),
    }),
  ],
});
