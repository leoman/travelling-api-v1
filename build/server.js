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
exports.server = exports.Query = void 0;
const lodash_1 = require("lodash");
const express_1 = __importDefault(require("express"));
const apollo_server_1 = require("apollo-server");
const apollo_server_express_1 = require("apollo-server-express");
const posts_1 = require("./posts");
const locations_1 = require("./locations");
const photos_1 = require("./photos");
const auth_1 = require("./auth");
const database_1 = require("./database/database");
database_1.sequelizeCheck();
// sequelizeSync(false)
exports.Query = `
  type Query {
    _empty: String,
    hello: String

  }
  type Mutation {
    _empty: String,
  }
`;
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};
const schema = apollo_server_1.makeExecutableSchema({
    typeDefs: [exports.Query, posts_1.postTypeDef, locations_1.locationTypeDef, photos_1.photoTypeDef, auth_1.authTypeDef],
    // @ts-ignore
    resolvers: lodash_1.merge(resolvers, posts_1.postResolver, photos_1.photoResolver, auth_1.authResolver),
});
exports.server = new apollo_server_express_1.ApolloServer({ schema, context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () { return auth_1.authenticateToken(req); }) });
const app = express_1.default();
exports.server.applyMiddleware({ app });
exports.default = app;
