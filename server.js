'use strict';

var logger = require('./includes/logger'),
    sockets = require('./includes/sockets');

var express = require('express'),
    routes = express(),
    compression = require('compression'),
    server = require('http').Server(routes);

// set up http request pathways
routes.use(compression());
routes.get('/', function(req, res, next){
        res.sendFile(__dirname + '/public/index.html');
      })
      .get('/observer', function(req, res, next){
        res.sendFile(__dirname + '/public/observer.html');
      })
      .use('/', express.static(__dirname + '/public'));


// start server
var port = process.env.PORT || 5000;
server.listen(port, function(){
  logger.info('starting server on port ' + port);
});

sockets.initIo(server);
