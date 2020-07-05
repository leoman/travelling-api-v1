"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.patchLocationKeys = exports.patchPostKeys = void 0;
const allPosts_1 = __importDefault(require("./allPosts"));
const post_1 = __importDefault(require("./post"));
const addPost_1 = __importDefault(require("./addPost"));
const editPost_1 = __importDefault(require("./editPost"));
const deletePost_1 = __importDefault(require("./deletePost"));
exports.patchPostKeys = [
    'title',
    'titleColour',
    'content',
    'date',
    'order',
    'photo',
    'status',
];
exports.patchLocationKeys = [
    'lat',
    'lng',
    'location',
    'duration',
    'hideFromBounding'
];
exports.resolvers = {
    Query: {
        allPosts: allPosts_1.default,
        post: post_1.default
    },
    Mutation: {
        addPost: addPost_1.default,
        editPost: editPost_1.default,
        deletePost: deletePost_1.default
    }
};
