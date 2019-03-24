'use strict';

// all game logic is stored here, inputs and outputs are called and received through sockets.js

var players = {};

var Player = function(id, color){
  this.id = id;
  this.color = color;
  this.x = 0;
  this.y = 0;
  this.joystick = [0, 0];
}
// returns an object containing game info when a player connects
Player.prototype.getGameInfo = function(){
  return {};
}
Player.prototype.buttonDown = function(btn){

}
Player.prototype.buttonUp = function(btn){

}
module.exports.Player = Player;

// called when a client is added; must return a player object
function addClient(id, color){
  var p = new Player(id, color);
  players[id] = p;
  return p;
}
module.exports.addClient = addClient;

// called when a client disconnects
function removeClient(id){
  delete players[id];
}
module.exports.removeClient = removeClient;

// update / draw function
function getUpdate(){

}
module.exports.getUpdate = getUpdate;
