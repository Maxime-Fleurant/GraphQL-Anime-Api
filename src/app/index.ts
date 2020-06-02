import 'reflect-metadata';
import path from 'path';
import express from 'express';
import { createConnection, useContainer, getCustomRepository } from 'typeorm';
import Dataloader from 'dataloader';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { AnimeResolver } from '../modules/anime/anime.resolver';
import { CharacterResolver } from '../modules/character/character.resolver';
import { StudioResolver } from '../modules/studio/studio.resolver';
import { GenreResolver } from '../modules/genre/genre.resolver';

import { CharacterRepository } from '../modules/character/character.repository';
import { Loader } from './createLoader';

Container.set('dataloader', Dataloader);

useContainer(Container);

const start = async (): Promise<void> => {
  const app = express();

  await createConnection();
  Container.get(Loader);
  const schema = await buildSchema({
    resolvers: [AnimeResolver, CharacterResolver, StudioResolver, GenreResolver],
    container: Container,
    emitSchemaFile: { path: path.resolve(__dirname, '../common/api.graphql') },
  });

  const characterRepo = getCustomRepository(CharacterRepository);
  const apolloServer = new ApolloServer({
    schema,
    context: () => {
      return {
        testLoader: new Dataloader((keys) => characterRepo.batchFindbyAnime(keys)),
      };
    },
  });

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
};

start();
