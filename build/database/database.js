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
exports.sequelizeSync = exports.sequelizeCheck = void 0;
const sequelize_1 = require("sequelize");
const logging_1 = __importDefault(require("../logging"));
const config_1 = require("../config");
const config = config_1.getDatabaseConfig(process.env.NODE_ENV || 'development');
const sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
exports.sequelizeCheck = () => __awaiter(void 0, void 0, void 0, function* () {
    sequelize
        .authenticate()
        .then(() => {
        logging_1.default.log('info', 'Connection to the database has been established successfully.');
    })
        .catch((err) => {
        console.log(err);
        logging_1.default.log({
            level: 'error',
            message: 'Unable to connect to the database:',
            err
        });
    });
});
exports.sequelizeSync = (force) => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.sync({ force: force });
});
exports.default = sequelize;
