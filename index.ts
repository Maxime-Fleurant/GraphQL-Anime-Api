import 'reflect-metadata';

import express from 'express';
import { createConnection, useContainer, getRepository } from 'typeorm';
import Dataloader from 'dataloader';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { AnimeResolver } from './modules/anime/anime.resolver';
import { CharacterResolver } from './modules/character/character.resolver';
import { StudioResolver } from './modules/studio/studio.resolver';
import { GenreResolver } from './modules/genre/genre.resolver';
import { Character } from './modules/character/character.type';

useContainer(Container);

// TYPE DEFINITION
export interface IContext {
  test: string;
}

//
const start = async (): Promise<void> => {
  const app = express();

  await createConnection();

  const schema = await buildSchema({
    resolvers: [AnimeResolver, CharacterResolver, StudioResolver, GenreResolver],
    container: Container,
    emitSchemaFile: true,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: {
      characterDataloader: new Dataloader(async (characterIds) => {
        const characterRepository = getRepository(Character);
        const result = characterRepository.find(characterIds);
      }),
    },
  });

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
};

start();
