const Location = require('./location');

module.exports = function(sequelize, DataTypes) {

    const Post = sequelize.define('Post', {
        titleColour: {
            type: DataTypes.STRING
        },
        Content: {
            type: DataTypes.TEXT
        },
    });

    Post.associate = models => {
        models.Post.belongsTo(models.Location, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      };

    return Post;
    
};
