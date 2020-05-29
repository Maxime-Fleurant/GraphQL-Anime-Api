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
exports.AnimeResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const typeorm_1 = require("typeorm");
const anime_type_1 = require("./anime.type");
const character_type_1 = require("../character/character.type");
const studio_type_1 = require("../studio/studio.type");
const anime_input_1 = require("./types/anime-input");
const character_input_1 = require("../character/types/character-input");
let AnimeResolver = /** @class */ (() => {
    let AnimeResolver = class AnimeResolver {
        constructor(animeRepository, characterRepository, studioRepository) {
            this.animeRepository = animeRepository;
            this.characterRepository = characterRepository;
            this.studioRepository = studioRepository;
        }
        async animes() {
            const animes = await this.animeRepository.find();
            return animes;
        }
        async anime(id, context) {
            const anime = await this.animeRepository.findOne(id);
            return anime;
        }
        async characters(parent) {
            const characters = await this.characterRepository.find({ where: { anime: parent.id } });
            return characters;
        }
        async studio(parent) {
            const studio = await this.studioRepository.findOne(parent.studioId);
            return studio;
        }
        async genres(parent) {
            const genres = await this.animeRepository
                .createQueryBuilder()
                .relation(anime_type_1.Anime, 'genres')
                .of(parent.id)
                .loadMany();
            return genres;
        }
        async createAnime({ title, desciption, studioId, genreIds }, charactersData) {
            const genreMap = genreIds.map((genreId) => {
                return { id: genreId };
            });
            const newAnime = this.animeRepository.create({
                title,
                desciption,
                studio: { id: studioId },
                genres: genreMap,
                characters: charactersData,
            });
            return this.animeRepository.save(newAnime);
        }
        async addGenreFromAnime(animeId, genreIds) {
            await this.animeRepository
                .createQueryBuilder()
                .relation(anime_type_1.Anime, 'genres')
                .of(animeId)
                .add(genreIds);
            return this.animeRepository.findOne(animeId);
        }
        async removeGenreFromAnime(animeId, genreIds) {
            await this.animeRepository
                .createQueryBuilder()
                .relation(anime_type_1.Anime, 'genres')
                .of(animeId)
                .remove(genreIds);
            return this.animeRepository.findOne(animeId);
        }
        async updateAnime(animeId, updateData) {
            const { studioId, ...formatedUpdateData } = {
                ...updateData,
                studio: updateData.studioId ? { id: updateData.studioId } : undefined,
            };
            await this.animeRepository.update(animeId, formatedUpdateData);
            const anime = await this.animeRepository.findOne(animeId);
            return anime;
        }
        async deleteAnime(animeId) {
            await this.animeRepository.delete(animeId);
            return 'deleted';
        }
    };
    __decorate([
        type_graphql_1.Query(() => [anime_type_1.Anime]),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "animes", null);
    __decorate([
        type_graphql_1.Query(() => anime_type_1.Anime),
        __param(0, type_graphql_1.Arg('id')), __param(1, type_graphql_1.Ctx()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "anime", null);
    __decorate([
        type_graphql_1.FieldResolver(),
        __param(0, type_graphql_1.Root()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [anime_type_1.Anime]),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "characters", null);
    __decorate([
        type_graphql_1.FieldResolver(),
        __param(0, type_graphql_1.Root()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [anime_type_1.Anime]),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "studio", null);
    __decorate([
        type_graphql_1.FieldResolver(),
        __param(0, type_graphql_1.Root()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [anime_type_1.Anime]),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "genres", null);
    __decorate([
        type_graphql_1.Mutation(() => anime_type_1.Anime),
        __param(0, type_graphql_1.Arg('animeData')),
        __param(1, type_graphql_1.Arg('charactersData', () => [character_input_1.BaseCharacterInput], { nullable: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [anime_input_1.AnimeInput, Array]),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "createAnime", null);
    __decorate([
        type_graphql_1.Mutation(() => anime_type_1.Anime),
        __param(0, type_graphql_1.Arg('animeId')),
        __param(1, type_graphql_1.Arg('genreIds', () => [Number])),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Array]),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "addGenreFromAnime", null);
    __decorate([
        type_graphql_1.Mutation(() => anime_type_1.Anime),
        __param(0, type_graphql_1.Arg('animeId')),
        __param(1, type_graphql_1.Arg('genreIds', () => [Number])),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Array]),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "removeGenreFromAnime", null);
    __decorate([
        type_graphql_1.Mutation(() => anime_type_1.Anime),
        __param(0, type_graphql_1.Arg('animeId')),
        __param(1, type_graphql_1.Arg('updateData')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, anime_input_1.UpdateAnimeInput]),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "updateAnime", null);
    __decorate([
        type_graphql_1.Mutation(() => String),
        __param(0, type_graphql_1.Arg('animeId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], AnimeResolver.prototype, "deleteAnime", null);
    AnimeResolver = __decorate([
        type_graphql_1.Resolver(() => anime_type_1.Anime),
        __param(0, typeorm_typedi_extensions_1.InjectRepository(anime_type_1.Anime)),
        __param(1, typeorm_typedi_extensions_1.InjectRepository(character_type_1.Character)),
        __param(2, typeorm_typedi_extensions_1.InjectRepository(studio_type_1.Studio)),
        __metadata("design:paramtypes", [typeorm_1.Repository,
            typeorm_1.Repository,
            typeorm_1.Repository])
    ], AnimeResolver);
    return AnimeResolver;
})();
exports.AnimeResolver = AnimeResolver;
