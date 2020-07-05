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
exports.default = (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, slug } = args;
        if (!id && !slug) {
            throw new apollo_server_1.UserInputError(`No ID or Slug was provided`, {
                invalidArgs: args,
            });
        }
        const where = (id) ? { id } : { slug };
        logging_1.default.log('info', `Finding a single Post: ${JSON.stringify(where)}`);
        const post = yield __1.Post.findOne({ where: where, include: [
                { association: __1.Post.associations.Location, },
                { association: __1.Post.associations.Photos, }
            ] });
        if (!post) {
            throw new apollo_server_1.UserInputError(`No Post found with ID: ${args.id}`, {
                invalidArgs: args,
            });
        }
        return Object.assign(Object.assign({}, post.dataValues), { 
            // @ts-ignore
            location: post.Location, 
            // @ts-ignore
            photos: post.Photos });
    }
    catch (error) {
        logging_1.default.log({
            level: 'error',
            message: 'Unable to fetch a single Post',
            extra: error.message
        });
        throw new apollo_server_1.ApolloError(`Unable to fetch Post`, '500', {
            error
        });
    }
});
