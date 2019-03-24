'use strict';

var winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({filename: './logs/server.log'}),
    new winston.transports.Console({format: winston.format.simple()})
  ]
});

module.exports = logger;
