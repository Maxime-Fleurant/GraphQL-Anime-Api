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
const type_graphql_1 = require("type-graphql");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const typeorm_1 = require("typeorm");
const anime_type_1 = require("../anime/anime.type");
const studio_type_1 = require("./studio.type");
let StudioResolver = class StudioResolver {
    constructor(animeRepository, studioRepository) {
        this.animeRepository = animeRepository;
        this.studioRepository = studioRepository;
    }
    async studios() {
        return this.studioRepository.find();
    }
    async studio(id) {
        return this.studioRepository.findOne(id);
    }
    async animes(parent) {
        const animes = await this.animeRepository.find({ where: { studio: parent.id } });
        return animes;
    }
    async createStudio(studioName) {
        const newStudio = this.studioRepository.save(this.studioRepository.create({ name: studioName }));
        return newStudio;
    }
    async updateStudio(studioID, studioName) {
        await this.studioRepository.update(studioID, { name: studioName });
        const updatedStudio = await this.studioRepository.findOne(studioID);
        return updatedStudio;
    }
    async deleteStudio(studioId) {
        await this.studioRepository.delete(studioId);
        return 'deleted';
    }
};
__decorate([
    type_graphql_1.Query(() => [studio_type_1.Studio]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudioResolver.prototype, "studios", null);
__decorate([
    type_graphql_1.Query(() => studio_type_1.Studio),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudioResolver.prototype, "studio", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [studio_type_1.Studio]),
    __metadata("design:returntype", Promise)
], StudioResolver.prototype, "animes", null);
__decorate([
    type_graphql_1.Mutation(() => studio_type_1.Studio),
    __param(0, type_graphql_1.Arg('studioName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudioResolver.prototype, "createStudio", null);
__decorate([
    type_graphql_1.Mutation(() => studio_type_1.Studio),
    __param(0, type_graphql_1.Arg('studioId')),
    __param(1, type_graphql_1.Arg('studioName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], StudioResolver.prototype, "updateStudio", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('studioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StudioResolver.prototype, "deleteStudio", null);
StudioResolver = __decorate([
    type_graphql_1.Resolver(() => studio_type_1.Studio),
    __param(0, typeorm_typedi_extensions_1.InjectRepository(anime_type_1.Anime)),
    __param(1, typeorm_typedi_extensions_1.InjectRepository(studio_type_1.Studio)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], StudioResolver);
exports.StudioResolver = StudioResolver;
