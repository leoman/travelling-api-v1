import http from 'http';
import path from'path';
import methods from 'methods';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorhandler from 'errorhandler';
import swaggerUi from 'swagger-ui-express';
import models from './models';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerJsDocOptions from './swagger';
import morgan from 'morgan';
import methodOverride from 'method-override';
import routes from './routes';

const isProduction = process.env.NODE_ENV === 'production';

const specs = swaggerJsdoc(swaggerJsDocOptions);

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(__dirname + '/public'));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

if (!isProduction) {
  app.use(errorhandler());
}

app.use(routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// {force: true}
models.sequelize.sync().then(function() {

// finally, let's start our server...
    const server = app.listen( process.env.PORT || 3010, function(){
        console.log('Listening on port ' + server.address().port);
    });

});