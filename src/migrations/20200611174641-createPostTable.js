const validStatuses = ['live', 'draft']

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('posts', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
      },
      slug: {
          type: Sequelize.DataTypes.STRING(128)
      },
      titleColour: {
          type: Sequelize.DataTypes.STRING(128)
      },
      content: {
          type: Sequelize.DataTypes.TEXT
      },
      date: {
          type: Sequelize.DataTypes.DATE
      },
      order: {
          type: Sequelize.DataTypes.DATE
      },
      photo: {
          type: Sequelize.DataTypes.STRING(256)
      },
      status: {
          type: Sequelize.DataTypes.ENUM,
          values: validStatuses,
          defaultValue: 'live',
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
    return queryInterface.dropTable('posts');
  }
};
