"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = exports.ConfigEnviroment = void 0;
const database_1 = __importDefault(require("./database"));
var ConfigEnviroment;
(function (ConfigEnviroment) {
    ConfigEnviroment["development"] = "development";
    ConfigEnviroment["test"] = "test";
    ConfigEnviroment["production"] = "production";
})(ConfigEnviroment = exports.ConfigEnviroment || (exports.ConfigEnviroment = {}));
const configs = database_1.default;
exports.getDatabaseConfig = (env) => {
    if (env && configs[env]) {
        return configs[env];
    }
    throw Error('A database config could not be found');
};
