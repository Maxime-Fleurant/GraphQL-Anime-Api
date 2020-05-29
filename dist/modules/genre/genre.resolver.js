"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const typeorm_1 = require("typeorm");
const genre_type_1 = require("./genre.type");
let GenreResolver = /** @class */ (() => {
    let GenreResolver = class GenreResolver {
        constructor(genreRepository) {
            this.genreRepository = genreRepository;
        }
        async genres() {
            return this.genreRepository.find();
        }
        async genre(id) {
            return this.genreRepository.findOne(id);
        }
        async animes(parent) {
            const animes = await this.genreRepository
                .createQueryBuilder()
                .relation(genre_type_1.Genre, 'animes')
                .of(parent.id)
                .loadMany();
            return animes;
        }
    };
    __decorate([
        type_graphql_1.Query(() => [genre_type_1.Genre]),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], GenreResolver.prototype, "genres", null);
    __decorate([
        type_graphql_1.Query(() => genre_type_1.Genre),
        __param(0, type_graphql_1.Arg('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], GenreResolver.prototype, "genre", null);
    __decorate([
        type_graphql_1.FieldResolver(),
        __param(0, type_graphql_1.Root()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [genre_type_1.Genre]),
        __metadata("design:returntype", Promise)
    ], GenreResolver.prototype, "animes", null);
    GenreResolver = __decorate([
        type_graphql_1.Resolver(() => genre_type_1.Genre),
        __param(0, typeorm_typedi_extensions_1.InjectRepository(genre_type_1.Genre)),
        __metadata("design:paramtypes", [typeorm_1.Repository])
    ], GenreResolver);
    return GenreResolver;
})();
exports.GenreResolver = GenreResolver;
