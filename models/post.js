const Location = require('./location');

module.exports = function(sequelize, DataTypes) {

    const Post = sequelize.define('post', {
        titleColour: {
            type: DataTypes.STRING
        },
        content: {
            type: DataTypes.TEXT
        },
    });

    return Post;
    
};
