import 'reflect-metadata';

import express from 'express';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLModule } from '@graphql-modules/core';
import { AnimeModule } from './modules/anime';
import { Anime } from './modules/anime/anime.type';

const start = async () => {
  const app = express();

  await createConnection();
  console.log(await Anime.find());
  const { schema } = new GraphQLModule({
    imports: [AnimeModule],
  });

  const apolloServer = new ApolloServer({
    schema,
  });

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
};

start();
