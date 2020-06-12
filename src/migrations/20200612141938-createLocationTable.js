module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('locations', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      location: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
      },
      lat: {
          type: Sequelize.DataTypes.FLOAT
      },
      lng: {
          type: Sequelize.DataTypes.FLOAT
      },
      duration: {
          type: Sequelize.DataTypes.INTEGER
      },
      hideFromBounding: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('locations');
  }
};
