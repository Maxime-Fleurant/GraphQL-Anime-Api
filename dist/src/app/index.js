"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const dataloader_1 = __importDefault(require("dataloader"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const anime_resolver_1 = require("../modules/anime/anime.resolver");
const character_resolver_1 = require("../modules/character/character.resolver");
const studio_resolver_1 = require("../modules/studio/studio.resolver");
const genre_resolver_1 = require("../modules/genre/genre.resolver");
typeorm_1.useContainer(typedi_1.Container);
//
const start = async () => {
    const app = express_1.default();
    await typeorm_1.createConnection();
    const schema = await type_graphql_1.buildSchema({
        resolvers: [anime_resolver_1.AnimeResolver, character_resolver_1.CharacterResolver, studio_resolver_1.StudioResolver, genre_resolver_1.GenreResolver],
        container: typedi_1.Container,
        emitSchemaFile: true,
    });
    const testFunc = async (keys) => {
        return keys;
    };
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        context: {
            characterDataloader: new dataloader_1.default((keys) => testFunc(keys)),
        },
    });
    apolloServer.applyMiddleware({ app });
    app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000`));
};
start();
