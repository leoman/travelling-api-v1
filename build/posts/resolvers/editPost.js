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
const _1 = require("./");
exports.default = (_parent, args, { decodedToken }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!decodedToken) {
        throw new apollo_server_1.UserInputError('Not Authenticated, please sign in');
    }
    try {
        const post = yield __1.Post.findOne({ where: { id: args.id }, include: [
                { association: __1.Post.associations.Location, }
            ] });
        if (!post) {
            throw new apollo_server_1.UserInputError(`No Post found with ID: ${args.id}`, {
                invalidArgs: args,
            });
        }
        const postFieldsToUpdate = _1.patchPostKeys.reduce((agg, key) => {
            if (args[key] || args.hasOwnProperty(key)) {
                agg[key] = args[key];
            }
            return agg;
        }, {});
        const locationFieldsToUpdate = _1.patchLocationKeys.reduce((agg, key) => {
            if (args[key] || args.hasOwnProperty(key)) {
                agg[key] = args[key];
            }
            return agg;
        }, {});
        const updatedPost = yield post.update(postFieldsToUpdate);
        // @ts-ignore
        const updatedLocation = yield updatedPost.Location.update(locationFieldsToUpdate);
        logging_1.default.log('info', `Editing a Post with ID: ${args.id}`);
        return Object.assign(Object.assign({}, updatedPost.dataValues), { location: Object.assign({}, updatedLocation.dataValues) });
    }
    catch (error) {
        throw new apollo_server_1.ApolloError(`Unable to update Post with ID: ${args.id}`, '500', {
            error
        });
    }
});
