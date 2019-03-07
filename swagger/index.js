const options = {
    swaggerDefinition: {
      // Like the one described here: https://swagger.io/specification/#infoObject
      info: {
        title: 'Travelling API',
        version: '1.0.0',
        description: 'Travelling API for all our adventures',
      },
    },
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['./routes/api/**.js'],
};

module.exports = options;