"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class Location extends sequelize_1.Model {
}
Location.init({
    id: {
        type: new sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    location: {
        type: new sequelize_1.DataTypes.STRING(128),
    },
    lat: {
        type: new sequelize_1.DataTypes.FLOAT
    },
    lng: {
        type: new sequelize_1.DataTypes.FLOAT
    },
    duration: {
        type: new sequelize_1.DataTypes.INTEGER,
    },
    hideFromBounding: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: new sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: new sequelize_1.DataTypes.DATE
    },
}, {
    sequelize: database_1.default,
    tableName: 'locations',
});
exports.default = Location;
