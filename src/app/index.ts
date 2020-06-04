import 'reflect-metadata';

import path from 'path';
import express from 'express';
import { createConnection, useContainer } from 'typeorm';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
impor't { Container } from 'typedi';

import { CharacterResolver } from '../modules/character/character.resolver';
import { StudioResolver } from '../modules/studio/studio.resolver';
import { GenreResolver } from '../modules/genre/genre.resolver';

import { AnimeResolver } from '../modules/anime/anime.resolver';
import { Loader } from './Loader';

useContainer(Container);
 
const start = async (): Promise<void> => {
  const app = express();

  awai't createConnection();

  const schema = await buildSchema({
    resolvers: [AnimeResolver, CharacterResolver, StudioResolver, GenreResolver],
    container: Container,
    emitSchemaFile: { path: path.resolve(__dirname, '../common/api.graphql') },
  });

  const apolloServer = new ApolloServer({
    schema,
    context: () => {
      return {
        loaders: {},
      };
    },
  });

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
};

start();
