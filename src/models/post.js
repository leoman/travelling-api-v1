import Joi from 'joi';
import slugify from 'slugify';

module.exports = function(sequelize, DataTypes) {

    const validStatuses = ['live', 'draft'];

    const PostSchema = Joi.object().keys({
        title: Joi.string().required(),
        titleColour: Joi.string(),
        content: Joi.string(),
        date: Joi.any().optional(),
        photo: Joi.string(),
        status: Joi.string().valid(validStatuses),
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
        status: {
            type: DataTypes.ENUM,
            values: validStatuses,
            defaultValue: validStatuses[0],
        },
    });

    Post.Schema = PostSchema;

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

        models.post.Schema = models.post.Schema.append({
            location: models.location.Schema
        });
    };

    Post.addHook('beforeSave', (post, options) => {
        post.slug = slugify(post.title);
    });

    return Post;
    
};
