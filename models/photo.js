const Location = require('./location');

module.exports = function(sequelize, DataTypes) {

    const Photo = sequelize.define('photo', {
        url: {
            type: DataTypes.STRING
        },
    });

    return Photo;
    
};
