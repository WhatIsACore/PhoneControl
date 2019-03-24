'use strict';

// controller = a mobile or phone screen, sends input to the server
// observer = a computer or projector screen, receives output from the server

var logger = require('./logger');
var game = require('./game');

var io;

// initialize the socketio server
function initIo(server){
  io = require('socket.io')(server);
  controllers.io = io.of('/controller');
  observers.io = io.of('/observer');
  controllers.io.on('connection', connectController);
  observers.io.on('connection', connectObserver);
  setInterval(update, 15);
}
module.exports.initIo = initIo;

var controllers = {};
var observers = {};

var Controller = function(socket, id){
  this.socket = socket;
  this.id = id;
  this.color = Colors[id];
  this.player = game.addClient(id, Colors[id]);
}

var Observer = function(socket, id){
  this.socket = socket;
  this.id = id;
}

// colors to give controller, index = controller id
var Colors = [
  '#FF6633', '#FFB399', '#FF33FF', '#444444', '#00B3E6',
	'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
	'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
	'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
	'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
	'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
	'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
	'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
	'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];

function connectController(socket){
  // the id for the controller is the same as the index of its color
  var id = Math.floor(Math.random() * Colors.length);
  while(id in controllers) id = Math.floor(Math.random() * colors.length);
  var c = new Controller(socket, id)
  controllers[id] = c;
  socket.controller = c;

  logger.info('controller id=' + id + ' connected.');

  // pass both general client info and game-specific info back to the controller
  socket.emit('client-info', {id: id, color: Colors[id]}, c.player.getGameInfo());

  socket.on('disconnect', function(){
    logger.info('controller id=' + socket.controller.id + ' disconnected.');
    game.removeClient(socket.controller.id);
    delete controllers[socket.controller.id];
    socket.disconnect();
  });

  // manage input events
  socket.on('button-down', function(btn){
    socket.controller.player.buttonDown(btn);
  });
  socket.on('button-up', function(btn){
    socket.controller.player.buttonUp(btn);
  });
  socket.on('joystick-update', function(c){
    socket.controller.player.joystickUpdate(c);
  });

}
module.exports.connectController = connectController;

function connectObserver(socket){
  var id = Math.floor(Math.random() * 100000);
  while(id in observers) id = Math.floor(Math.random() * 100000);
  observers[id] = new Observer(socket, id);
  socket.observer = observers[id];

  logger.info('observer id=' + id + ' connected.');

  socket.on('disconnect', function(){
    logger.info('observer id=' + socket.observer.id + ' disconnected.');
    delete observers[socket.observer.id];
    socket.disconnect();
  });
}
module.exports.connectObserver = connectObserver;

function update(){
  observers.io.emit('update', game.getUpdate());
}
