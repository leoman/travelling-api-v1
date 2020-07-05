"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const logging_1 = __importDefault(require("../../logging"));
const __1 = require("../");
const posts_1 = require("../../posts");
exports.default = (_parent, args, { decodedToken }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!decodedToken) {
            throw new apollo_server_1.UserInputError('Not Authenticated, please sign in');
        }
        const post = yield posts_1.Post.findOne({ where: { id: args.id }, include: [
                { association: posts_1.Post.associations.Photos }
            ] });
        if (!post) {
            throw new apollo_server_1.UserInputError(`No Post found with ID: ${args.id}`, {
                invalidArgs: args,
            });
        }
        // @ts-ignore
        const photo = yield __1.Photo
            .create({
            url: args.url,
        });
        // @ts-ignore
        yield post.addPhoto(photo);
        // @ts-ignore
        logging_1.default.log('info', `Saving a new Photo to a post Post ${photo.url}`);
        return photo;
    }
    catch (error) {
        console.log(error);
        logging_1.default.log({
            level: 'error',
            message: 'Error saving a new Photo',
            errors: error.errors.map((error) => error.message)
        });
        throw new apollo_server_1.UserInputError(error.errors.map((error) => error.message), {
            invalidArgs: args,
        });
    }
});
