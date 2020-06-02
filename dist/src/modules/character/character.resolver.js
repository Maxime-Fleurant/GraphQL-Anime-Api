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
const character_type_1 = require("./character.type");
const anime_type_1 = require("../anime/anime.type");
const character_input_1 = require("./types/character-input");
let CharacterResolver = class CharacterResolver {
    constructor(animeRepository, characterRepository) {
        this.animeRepository = animeRepository;
        this.characterRepository = characterRepository;
    }
    async characters() {
        return this.characterRepository.find();
    }
    async character(id) {
        return this.characterRepository.findOne(id);
    }
    async anime(parent) {
        const anime = await this.animeRepository.findOne(parent.animeId);
        return anime;
    }
    async createCharacter(characterData) {
        const { animeId, ...formatedCharacterData } = {
            ...characterData,
            anime: { id: characterData.animeId },
        };
        const newCharacter = this.characterRepository.save(this.characterRepository.create(formatedCharacterData));
        return newCharacter;
    }
    async updateCharacter(characterId, characterData) {
        await this.characterRepository.update(characterId, characterData);
        const updatedCharacter = await this.characterRepository.findOne(characterId);
        return updatedCharacter;
    }
    async deleteCharacter(characterId) {
        await this.characterRepository.delete(characterId);
        return 'deleted';
    }
};
__decorate([
    type_graphql_1.Query(() => [character_type_1.Character]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "characters", null);
__decorate([
    type_graphql_1.Query(() => character_type_1.Character),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "character", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [character_type_1.Character]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "anime", null);
__decorate([
    type_graphql_1.Mutation(() => character_type_1.Character),
    __param(0, type_graphql_1.Arg('characterData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [character_input_1.CharacterInput]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "createCharacter", null);
__decorate([
    type_graphql_1.Mutation(() => character_type_1.Character),
    __param(0, type_graphql_1.Arg('characterId')),
    __param(1, type_graphql_1.Arg('characterData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, character_input_1.UpdateCharacterInput]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "updateCharacter", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('characterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "deleteCharacter", null);
CharacterResolver = __decorate([
    type_graphql_1.Resolver(() => character_type_1.Character),
    __param(0, typeorm_typedi_extensions_1.InjectRepository(anime_type_1.Anime)),
    __param(1, typeorm_typedi_extensions_1.InjectRepository(character_type_1.Character)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], CharacterResolver);
exports.CharacterResolver = CharacterResolver;
