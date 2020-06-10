import 'reflect-metadata';

import path from 'path';
import express from 'express';
import { createConnection, useContainer } from 'typeorm';
import dotEnv from 'dotenv';

import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import '../common/third-party/jwt';
import { AnimeResolver } from '../modules/anime/resolvers';
import { CharacterResolver } from '../modules/character/resolvers';
import { GenreResolver } from '../modules/genre/resolvers';
import { StudioResolver } from '../modules/studio/resolvers';
import { Loaders } from './loaders';
import { UserResolver } from '../modules/user/resolver';
import { User } from '../modules/user/user.type';
import { customAuthChecker } from './authChecker';

useContainer(Container);
dotEnv.config();

const start = async (): Promise<void> => {
  const app = express();

  await createConnection();

  const schema = await buildSchema({
    resolvers: [AnimeResolver, CharacterResolver, StudioResolver, GenreResolver, UserResolver],
    container: Container,
    emitSchemaFile: { path: path.resolve(__dirname, '../common/api.graphql') },
    authChecker: customAuthChecker,
  });

  const loaders = Container.get(Loaders);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      let user: Pick<User, 'id' | 'role'> | null;

      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        user = jwt.verify(token, process.env.JWT_SECRET as string) as Pick<User, 'id' | 'role'>;
      } else {
        user = null;
      }

      const context: IContext = {
        user: user ? { id: user.id, role: user.role } : null,
        loaders: loaders.createLoaders(),
      };

      return context;
    },
  });

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
};

start();

export interface IContext {
  loaders: ReturnType<Loaders['createLoaders']>;
  user: { id: number; role: string } | null;
}
