'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('photos', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE
      },
      PostId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
      },
    });

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('photos');
  }
};
