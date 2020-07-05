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
exports.resolvers = exports.authenticateUserCredentials = void 0;
const apollo_server_1 = require("apollo-server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logging_1 = __importDefault(require("../logging"));
const user_json_1 = __importDefault(require("../config/user.json"));
exports.authenticateUserCredentials = (username, password) => {
    const { user } = user_json_1.default.auth;
    let passwordIsValid = false;
    if (username === "" || password === "") {
        throw new apollo_server_1.UserInputError(`User credentials were incorrect`);
    }
    try {
        passwordIsValid = bcryptjs_1.default.compareSync(password, user.password);
    }
    catch (error) {
        throw new apollo_server_1.ApolloError(`An error occuered while parsing the users password`, '500', error);
    }
    if (username !== user.username || !passwordIsValid) {
        throw new apollo_server_1.UserInputError(`User credentials were incorrect`, {
            invalidArgs: [username, password],
        });
    }
    return user.username;
};
exports.resolvers = {
    Mutation: {
        login: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const username = exports.authenticateUserCredentials(args.username, args.password);
                const token = jsonwebtoken_1.default.sign({ username: username }, user_json_1.default.auth.secret, {
                    expiresIn: 86400
                });
                return { auth: true, token: token };
            }
            catch (error) {
                logging_1.default.log({
                    level: 'error',
                    message: 'Error logging in',
                });
                throw new apollo_server_1.UserInputError(`Error logging in`, {
                    invalidArgs: args,
                });
            }
        })
    }
};
