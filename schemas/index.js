const Post = require('../models').post;

module.exports = {
    '/posts': Post.Schema,
};