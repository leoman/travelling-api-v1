"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const allPhotos_1 = __importDefault(require("./allPhotos"));
const addPhoto_1 = __importDefault(require("./addPhoto"));
const deletePhoto_1 = __importDefault(require("./deletePhoto"));
exports.resolvers = {
    Query: {
        allPhotos: allPhotos_1.default
    },
    Mutation: {
        addPhoto: addPhoto_1.default,
        deletePhoto: deletePhoto_1.default
    }
};
