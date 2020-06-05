import 'reflect-metadata';

import path from 'path';
import express from 'express';
import { createConnection, useContainer } from 'typeorm';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { AnimeResolver } from '../modules/anime/resolvers';
import { CharacterResolver } from '../modules/character/resolvers';
import { GenreResolver } from '../modules/genre/resolvers';
import { StudioResolver } from '../modules/studio/resolvers';
import { Loaders } from './loaders';

useContainer(Container);

const start = async (): Promise<void> => {
  const app = express();

  await createConnection();

  const schema = await buildSchema({
    resolvers: [AnimeResolver, CharacterResolver, StudioResolver, GenreResolver],
    container: Container,
    emitSchemaFile: { path: path.resolve(__dirname, '../common/api.graphql') },
  });

  const loaders = Container.get(Loaders);

  const apolloServer = new ApolloServer({
    schema,
    context: () => {
      return {
        loaders: loaders.createLoaders(),
      };
    },
  });

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
};

start();

export interface IContext {
  loaders: ReturnType<Loaders['createLoaders']>;
}
