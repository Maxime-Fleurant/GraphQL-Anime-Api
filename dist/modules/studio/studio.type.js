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
exports.Studio = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const anime_type_1 = require("../anime/anime.type");
let Studio = /** @class */ (() => {
    let Studio = class Studio extends typeorm_1.BaseEntity {
    };
    __decorate([
        type_graphql_1.Field(() => type_graphql_1.ID),
        typeorm_1.PrimaryGeneratedColumn({ type: 'bigint' }),
        __metadata("design:type", Number)
    ], Studio.prototype, "id", void 0);
    __decorate([
        type_graphql_1.Field(),
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Studio.prototype, "name", void 0);
    __decorate([
        type_graphql_1.Field(() => [anime_type_1.Anime]),
        typeorm_1.OneToMany(() => anime_type_1.Anime, (anime) => anime.studio),
        __metadata("design:type", Array)
    ], Studio.prototype, "animes", void 0);
    Studio = __decorate([
        type_graphql_1.ObjectType(),
        typeorm_1.Entity()
    ], Studio);
    return Studio;
})();
exports.Studio = Studio;
