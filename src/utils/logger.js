const winston = require('winston');
const config = require('../utils/configurer');
const moment = require('moment');
require('winston-logstash');


const commonOptions = {
  timestamp() {
    return config.get('logger:useLocalTime') ? moment().format() : new Date().toISOString();
  },
  formatter(options) {
    // Return string will be passed to logger.
    const message = options.message ? options.message : '';
    const statusCode = options.meta && options.meta.res && options.meta.res.statusCode ?
          ` ${options.meta.res.statusCode}` : '';
    const responseTime = options.meta && options.meta.responseTime ?
          ` ${options.meta.responseTime}ms` : '';
    const id = options.meta && options.meta.id ?
          ` U=${options.meta.id}` : '';
    const hstoken = options.meta && options.meta.hstoken ?
          ` T=${options.meta.hstoken}` : '';
    const contentLength = options.meta && options.meta.contentLength ?
          ` S=${options.meta.contentLength}b` : '';
    return `${options.timestamp()} ${process.pid} [${options.level.toUpperCase()}] ${
      message}${statusCode}${responseTime}${id}${hstoken}${contentLength}${
        options.meta && config.get('logger:meta') && Object.keys(options.meta).length ?
          `\n\t${JSON.stringify(options.meta)}` : ''}`;
  },
  level: config.get('logger:level'),
};

// Send logs to a file
if (config.get('logger:file:enabled')) {
  const options = Object.assign({}, commonOptions, {
    filename: `${process.env.PLATFORM_HOME}/${config.get('logger:file:path')}`,
    json: config.get('logger:file:json'),
  });
  winston.add(winston.transports.File, options);
}

// Send logs to a logstash server to centralise them
if (config.get('logger:logstash:enabled')) {
  winston.add(winston.transports.Logstash, {
    port: config.get('logger:logstash:port'),
    node_name: config.get('logger:logstash:nodeName'),
    host: config.get('logger:logstash:host'),
  });
}

// Send logs to the console (STDOUT and STDERR)
try {
  winston.remove(winston.transports.Console);
} catch (err) {
  winston.log(`Winston catch error ${err}`);
}

if (config.get('logger:console:enabled')) {
  const options = Object.assign({}, commonOptions, {
    colorize: false,
  });
  winston.add(winston.transports.Console, options);
}

module.exports = winston;
