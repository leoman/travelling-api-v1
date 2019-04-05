const nconf = require('nconf');

nconf.argv();
nconf.file('custom', `${process.env.PLATFORM_HOME}/config/metal.json`);
nconf.file('environment', `./config/${process.env.NODE_ENV || 'development'}.json`);
nconf.file('default', './config/default.json');

module.exports = nconf;
