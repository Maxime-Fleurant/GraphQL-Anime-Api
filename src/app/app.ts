import { useContainer, createConnection } from 'typeorm';
import dotEnv from 'dotenv';
import Container, { Service } from 'typedi';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';

import { Loaders } from './loaders';
import { SchemaMaker } from './schema';
import { User } from '../modules/user/user.type';
import { Jwt } from '../common/third-party/jwt';
import { IContext } from '../common/types/IContext';

useContainer(Container);
dotEnv.config();

@Service()
export class App {
  constructor(private schema: SchemaMaker, private loaders: Loaders, private jwt: Jwt) {}

  async start() {
    const app = express();
    const schema = await this.schema.create();
    const loaders = await this.loaders.createLoaders();

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req }) => {
        let user: Pick<User, 'id' | 'role'> | null;

        if (req.headers.authorization) {
          const token = req.headers.authorization.split(' ')[1];

          user = this.jwt.jwt.verify(token, process.env.JWT_SECRET as string) as Pick<
            User,
            'id' | 'role'
          >;
        } else {
          user = null;
        }

        const context: IContext = {
          user: user ? { id: user.id, role: user.role } : null,
          loaders,
        };

        return context;
      },
    });

    apolloServer.applyMiddleware({ app });

    app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
  }
}

const start = async () => {
  await createConnection();

  const app = Container.get(App);

  app.start();
};

start();
