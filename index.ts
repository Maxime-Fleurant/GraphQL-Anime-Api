import 'reflect-metadata';

import express from 'express';
import { createConnection, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import { AnimeResolver } from './modules/anime/anime.resolver';
import { CharacterResolver } from './modules/character/character.resolver';
import { StudioResolver } from './modules/studio/studio.resolver';
import { GenreResolver } from './modules/genre/genre.resolver';

useContainer(Container);

const start = async (): Promise<void> => {
  const app = express();

  await createConnection();

  const schema = buildSchemaSync({
    resolvers: [AnimeResolver, CharacterResolver, StudioResolver, GenreResolver],
    container: Container,
  });

  const apolloServer = new ApolloServer({
    schema,
  });

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
};

start();
