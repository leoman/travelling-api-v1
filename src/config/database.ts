export default {
  "development": {
    "username": "travelling",
    "password": "password",
    "database": "travelling_development",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "travelling",
    "password": "password",
    "database": "travelling_test",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  },
  "production": {
    "username": process.env.PROD_DATABASE_USERNAME || null,
    "password": process.env.PROD_DATABASE_PASSWORD || null,
    "database": process.env.PROD_DATABASE_NAME || null,
    "host": process.env.PROD_DATABASE_HOST || null,
    "dialect": "postgres"
  }
}