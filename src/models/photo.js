export default function(sequelize, DataTypes) {

    const Photo = sequelize.define('photo', {
        url: {
            type: DataTypes.STRING
        },
    });

    return Photo;
    
};
