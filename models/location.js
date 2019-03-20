const Joi = require('joi');

module.exports = function(sequelize, DataTypes) {

    const LocationSchema = Joi.object().keys({
        location: Joi.string().required(),
        lat: Joi.number().precision(8),
        lng: Joi.number().precision(8),
        duration: Joi.number(),
        hideFromBounding: Joi.boolean().optional(),
    });

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
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });

    Location.Schema = LocationSchema;

    return Location;
    
};
