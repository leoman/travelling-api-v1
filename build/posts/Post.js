"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validStatuses = void 0;
const slugify_1 = __importDefault(require("slugify"));
const sequelize_1 = require("sequelize");
// import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
const database_1 = __importDefault(require("../database"));
const locations_1 = require("../locations");
const photos_1 = require("../photos");
const types_1 = require("../types");
class Post extends sequelize_1.Model {
}
exports.validStatuses = [types_1.Status.live, types_1.Status.draft];
Post.init({
    id: {
        type: new sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true
    },
    slug: {
        type: new sequelize_1.DataTypes.STRING(128)
    },
    titleColour: {
        type: new sequelize_1.DataTypes.STRING(128)
    },
    content: {
        type: new sequelize_1.DataTypes.TEXT
    },
    date: {
        type: new sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    order: {
        type: new sequelize_1.DataTypes.DATE
    },
    photo: {
        type: new sequelize_1.DataTypes.STRING(256)
    },
    status: {
        type: new sequelize_1.DataTypes.ENUM,
        values: exports.validStatuses,
        defaultValue: types_1.Status.live,
    },
    createdAt: {
        type: new sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: new sequelize_1.DataTypes.DATE
    },
}, {
    sequelize: database_1.default,
    tableName: 'posts',
});
Post.addHook('beforeSave', (post) => {
    // @ts-ignore
    post.slug = slugify_1.default(post.title, { lower: true });
});
Post.hasOne(locations_1.Location, {
    onDelete: "CASCADE",
    foreignKey: {
        allowNull: true
    }
});
Post.hasMany(photos_1.Photo, {
    onDelete: "CASCADE",
    foreignKey: {
        allowNull: true
    }
});
exports.default = Post;
