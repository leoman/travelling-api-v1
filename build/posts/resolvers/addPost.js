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
const locations_1 = require("../../locations");
exports.default = (_parent, args, { decodedToken }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!decodedToken) {
        throw new apollo_server_1.UserInputError('Not Authenticated, please sign in');
    }
    try {
        const location = yield locations_1.Location
            .create({
            lat: args.lat,
            lng: args.lng,
            location: args.location,
            duration: args.duration,
            hideFromBounding: args.hideFromBounding,
        });
        const post = yield __1.Post
            .create({
            title: args.title,
            titleColour: args.titleColour,
            content: args.content,
            date: args.date || new Date(),
            photo: args.photo,
            status: args.status,
            order: args.order,
        });
        // @ts-ignore
        yield post.setLocation(location);
        // @ts-ignore
        logging_1.default.log('info', `Saving a new Post ${post.title}`);
        return Object.assign(Object.assign({}, post.dataValues), { location: Object.assign({}, location.dataValues) });
    }
    catch (error) {
        logging_1.default.log({
            level: 'error',
            message: 'Error saving a new Post',
            errors: error.errors.map((error) => error.message)
        });
        throw new apollo_server_1.UserInputError(error.errors.map((error) => error.message), {
            invalidArgs: args,
        });
    }
});
