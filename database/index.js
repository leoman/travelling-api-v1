const Sequelize = require('sequelize');
const sequelize = new Sequelize('zuoemgfp', 'zuoemgfp', 'twH7zw2lekrarOkxPS1ovBP_-u7YqCxq', {
    host: 'manny.db.elephantsql.com',
    port: 5432,
    dialect: 'postgres'
  })

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
