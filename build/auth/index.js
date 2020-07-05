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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_1 = require("apollo-server");
const user_json_1 = __importDefault(require("../config/user.json"));
var typeDef_1 = require("./typeDef");
Object.defineProperty(exports, "authTypeDef", { enumerable: true, get: function () { return typeDef_1.typeDef; } });
var resolvers_1 = require("./resolvers");
Object.defineProperty(exports, "authResolver", { enumerable: true, get: function () { return resolvers_1.resolvers; } });
exports.authenticateToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(auth.substring(7), user_json_1.default.auth.secret);
            return { decodedToken };
        }
        catch (error) {
            throw new apollo_server_1.UserInputError('Failed to authenticate token.');
        }
    }
});
