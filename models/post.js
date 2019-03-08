const Joi = require('joi');

module.exports = function(sequelize, DataTypes) {

    const PostSchema = Joi.object().keys({
        title: Joi.string().required(),
        slug: Joi.string().required(),
        titleColour: Joi.string(),
        content: Joi.string(),
        photo: Joi.string(),
    });

    const Post = sequelize.define('post', {
        title: {
            type: DataTypes.STRING
        },
        slug: {
            type: DataTypes.STRING
        },
        titleColour: {
            type: DataTypes.STRING
        },
        content: {
            type: DataTypes.TEXT
        },
        date: {
            type: DataTypes.DATE
        },
        photo: {
            type: DataTypes.STRING
        },
    });

    Post.associate = models => {
        models.post.location = Post.hasOne(models.location, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
        });

        models.post.photo = Post.hasMany(models.photo, {
            onDelete: "CASCADE",
        });

    };

    Post.Schema = PostSchema;

    return Post;
    
};
