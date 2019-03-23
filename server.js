'use strict';

const config = require('./includes/config');
var logger = require('./includes/logger');

var express = require('express'),
    compression = require('compression'),
    app = express(),
    serv;

serv = require('http').Server(app);

// request pathways
app.use(compression());
app.get('/', function(req, res, next){
      res.sendFile(__dirname + '/public/index.html');
    })
    .use('/', express.static(__dirname + '/public'));

serv.listen(config.port, function(){
  logger.info('starting server on port ' + config.port);
});
