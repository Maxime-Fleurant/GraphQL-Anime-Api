"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeModule = void 0;
const core_1 = require("@graphql-modules/core");
const type_graphql_1 = require("type-graphql");
const anime_resolver_1 = require("./anime.resolver");
const anime_repository_1 = require("./anime.repository");
exports.AnimeModule = new core_1.GraphQLModule({
    providers: [anime_resolver_1.AnimeResolver, anime_repository_1.AnimeRepository],
    extraSchemas: [
        type_graphql_1.buildSchemaSync({
            resolvers: [anime_resolver_1.AnimeResolver],
            container: ({ context }) => exports.AnimeModule.injector.getSessionInjector(context),
        }),
    ],
});
