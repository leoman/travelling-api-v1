"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class Photo extends sequelize_1.Model {
}
Photo.init({
    id: {
        type: new sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    url: {
        type: new sequelize_1.DataTypes.STRING(128),
    },
    createdAt: {
        type: new sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: new sequelize_1.DataTypes.DATE
    },
}, {
    sequelize: database_1.default,
    tableName: 'photos',
});
exports.default = Photo;
