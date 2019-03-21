import http from 'http';
import path from'path';
import methods from 'methods';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorhandler from 'errorhandler';
import swaggerUi from 'swagger-ui-express';
import models from './src/models';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerJsDocOptions from './src/swagger';
import morgan from 'morgan';
import methodOverride from 'method-override';
import rateLimit from 'express-rate-limit';
import routes from './src/routes';

const isProduction = process.env.NODE_ENV === 'production';

const specs = swaggerJsdoc(swaggerJsDocOptions);

const limiter = new rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Create global app object
const app = express();

app.enable("trust proxy"); // Used as i am behind a reverse proxy (Heroku)

app.use(cors());

app.use(limiter);

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

// err: any, req: express.Request, res: express.Response, next: express.NextFunction

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
    const server = app.listen( process.env.PORT || 3010, function() {
        if(server) {
            console.log(`Listening on port ${process.env.PORT || 3010}`);
        }
    });

});