'use strict';

const config = require('./includes/config');
var logger = require('./includes/logger');

// express middleware
var compression = require('compression');
var minify = require('express-minify');

var express = require('express'),
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
