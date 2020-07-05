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
exports.default = (_parent, args, { decodedToken }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!decodedToken) {
        throw new apollo_server_1.UserInputError('Not Authenticated, please sign in');
    }
    const post = yield __1.Post.findOne({ where: { id: args.id } });
    if (!post) {
        throw new apollo_server_1.UserInputError(`No Post found with ID: ${args.id}`, {
            invalidArgs: args,
        });
    }
    try {
        yield post.destroy();
        logging_1.default.log('info', `Deleting a Post with ID: ${args.id}`);
        return { success: true, message: 'Deleted' };
    }
    catch (error) {
        throw new apollo_server_1.ApolloError(`Unable to delete Post with ID: ${args.id}`, '500', {
            error
        });
    }
});
