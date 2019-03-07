module.exports = function(sequelize, DataTypes) {

    const Location = sequelize.define('location', {
        location: {
            type: DataTypes.STRING
        },
        lat: {
            type: DataTypes.FLOAT
        },
        lng: {
            type: DataTypes.FLOAT
        },
        duration: {
            type: DataTypes.INTEGER
        },
        hideFromBounding: {
            type: DataTypes.BOOLEAN
        }
    });

    return Location;
    
};
