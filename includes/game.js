'use strict';

var logger = require('./logger');

var controllers = {};
var observers = {};

var Controller = function(socket, id){
  this.socket = socket;
  this.id = id;
  this.keys = [];
}

var Observer = function(socket, id){
  this.socket = socket;
  this.id = id;
}

// colors to give controller, index = controller id
var Colors = [
  '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
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

function connectObserver(socket){
  var id = Math.floor(Math.random() * 100000);
  while(id in observers) id = Math.floor(Math.random() * 100000);
  observers.id = new Observer(socket, id);
  socket.observer = observers.id;

  logger.info('observer id=' + id + ' connected.');

  socket.on('disconnect', function(){
    logger.info('observer id=' + socket.observer.id + ' disconnected.');
    delete observers[socket.observer.id];
    socket.disconnect();
  });
}
module.exports.connectObserver = connectObserver;

function connectController(socket){
  // the id for the controller is the same as the index of its color
  var id = Math.floor(Math.random() * Colors.length);
  while(id in controllers) id = Math.floor(Math.random() * colors.length);
  controllers.id = new Controller(socket, id);
  socket.controller = controllers.id;

  logger.info('controller id=' + id + ' connected.');

  socket.emit('client-info', {
    id: id,
    color: Colors[id]
  });

  socket.on('disconnect', function(){
    logger.info('controller id=' + socket.controller.id + ' disconnected.');
    delete controllers[socket.controller.id];
    socket.disconnect();
  });

  socket.on('key-down', function(key){
    socket.controller.keys.key = true;
  });

  socket.on('key-up', function(key){
    socket.controller.keys.key = false;
  });

}
module.exports.connectController = connectController;
