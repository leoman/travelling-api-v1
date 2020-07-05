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
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.log('info', 'Finding all Photos');
        // @ts-ignore
        const photos = yield __1.Photo.findAll();
        return photos;
    }
    catch (error) {
        logging_1.default.log({
            level: 'error',
            message: 'Unable to fetch all Photos',
            extra: error.message
        });
        throw new apollo_server_1.ApolloError(`Unable to fetch Photos`, '500', {
            error
        });
    }
});
