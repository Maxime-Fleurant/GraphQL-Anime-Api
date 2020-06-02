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
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
let BaseCharacterInput = class BaseCharacterInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], BaseCharacterInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MaxLength(50),
    __metadata("design:type", String)
], BaseCharacterInput.prototype, "description", void 0);
BaseCharacterInput = __decorate([
    type_graphql_1.InputType()
], BaseCharacterInput);
exports.BaseCharacterInput = BaseCharacterInput;
let CharacterInput = class CharacterInput extends BaseCharacterInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], CharacterInput.prototype, "animeId", void 0);
CharacterInput = __decorate([
    type_graphql_1.InputType()
], CharacterInput);
exports.CharacterInput = CharacterInput;
let UpdateCharacterInput = class UpdateCharacterInput {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], UpdateCharacterInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.MaxLength(50),
    __metadata("design:type", String)
], UpdateCharacterInput.prototype, "description", void 0);
UpdateCharacterInput = __decorate([
    type_graphql_1.InputType()
], UpdateCharacterInput);
exports.UpdateCharacterInput = UpdateCharacterInput;
