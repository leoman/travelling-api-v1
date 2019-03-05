module.exports = function(sequelize, DataTypes) {

    const Location = sequelize.define('Location', {
        slug: {
            type: DataTypes.STRING
        },
        lat: {
            type: DataTypes.FLOAT
        },
        lng: {
            type: DataTypes.FLOAT
        },
        location: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE
        },
        duration: {
            type: DataTypes.INTEGER
        },
        hideFromBounding: {
            type: DataTypes.BOOLEAN
        }
    });

    Location.associate = models => {
        models.Location.hasOne(models.Post);
    };

    return Location;
    
};
