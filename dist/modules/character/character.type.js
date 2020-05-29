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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const anime_type_1 = require("../anime/anime.type");
let Character = /** @class */ (() => {
    let Character = class Character extends typeorm_1.BaseEntity {
    };
    __decorate([
        type_graphql_1.Field(() => type_graphql_1.ID),
        typeorm_1.PrimaryGeneratedColumn({ type: 'bigint' }),
        __metadata("design:type", Number)
    ], Character.prototype, "id", void 0);
    __decorate([
        type_graphql_1.Field(),
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Character.prototype, "name", void 0);
    __decorate([
        type_graphql_1.Field(),
        typeorm_1.Column({ type: 'text' }),
        __metadata("design:type", String)
    ], Character.prototype, "description", void 0);
    __decorate([
        type_graphql_1.Field(() => anime_type_1.Anime),
        typeorm_1.ManyToOne(() => anime_type_1.Anime, (anime) => anime.characters, { onDelete: 'CASCADE' }),
        __metadata("design:type", anime_type_1.Anime)
    ], Character.prototype, "anime", void 0);
    __decorate([
        typeorm_1.RelationId((character) => character.anime),
        __metadata("design:type", Number)
    ], Character.prototype, "animeId", void 0);
    Character = __decorate([
        type_graphql_1.ObjectType(),
        typeorm_1.Entity()
    ], Character);
    return Character;
})();
exports.Character = Character;
