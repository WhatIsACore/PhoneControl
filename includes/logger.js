'use strict';

var winston = require('winston');
var config = require('./config');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({filename: './logs/server.log'})
  ]
});

if(config.debug){
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
