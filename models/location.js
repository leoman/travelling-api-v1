module.exports = function(sequelize, DataTypes) {

    const Location = sequelize.define('location', {
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
        models.location.post = Location.hasOne(models.post, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
        });

        models.location.photo = Location.hasMany(models.photo, {
            onDelete: "CASCADE",
        });

    };

    return Location;
    
};
