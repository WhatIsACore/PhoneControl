'use strict';

const config = require('./includes/config');
var logger = require('./includes/logger'),
    game = require('./includes/game');

var express = require('express'),
    routes = express(),
    compression = require('compression'),
    server = require('http').Server(routes),
    io = require('socket.io')(server);

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
server.listen(config.port, function(){
  logger.info('starting server on port ' + config.port);
});

// route socketio connections to the game
io.on('connection', function(socket){
  if(socket.handshake.query.type == 'observer'){
    game.connectObserver(socket);
  } else if(socket.handshake.query.type == 'controller'){
    game.connectController(socket);
  } else socket.disconnect();
});
