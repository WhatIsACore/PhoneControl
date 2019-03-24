'use strict';

var logger = require('./logger');

// all game logic is stored here, inputs and outputs are called and received through sockets.js

var players = {};

var Player = function(id, color){
  this.id = id;
  this.color = color;
  this.x = 0;
  this.y = 10;
  this.yVelocity = 0;
  this.xVelocity = 0;
  this.joystick = [0, 0];
  this.attackDelay = 0;
  this.facingDirection = 0;
  this.isInMidair = true;
}
// returns an object containing game info when a player connects
Player.prototype.getGameInfo = function(){
  return {};
}
Player.prototype.buttonDown = function(btn){
  if(btn == 0) this.jump();
  if(btn == 1) this.attack();
}
Player.prototype.buttonUp = function(btn){

}
Player.prototype.joystickUpdate = function(c){
  this.joystick = c;
  if(c[0] !== 0) this.facingDirection = c[0] > 0 ? 1 : -1;
}
module.exports.Player = Player;

Player.prototype.attack = function(){
  if(this.attackDelay === 0 && this.facingDirection !== 0){
    this.attackDelay = 30;

    // knock other players back
    for(var i in players){
      var p = players[i];
      if(!(p instanceof Player) || p.id === this.id) continue;

      if(this.facingDirection === 1 && p.x > this.x && p.x < this.x + 100){
        p.xVelocity = 6;
        p.yVelocity = 15;
        p.isInMidair = true;
      }
      if(this.facingDirection === -1 && p.x < this.x && p.x > this.x - 100){
        p.xVelocity = -6;
        p.yVelocity = 15;
        p.isInMidair = true;
      }
    }

  }
}
Player.prototype.jump = function(){
  if(!this.isInMidair){
    this.yVelocity = 18;
    this.isInMidair = true;
  }
}

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

  // update players
  for(var i in players){
    var p = players[i];
    if(!(p instanceof Player)) continue;

    if(p.attackDelay > 0) p.attackDelay--;
    if(p.isInMidair && p.yVelocity > -20) p.yVelocity -= 0.9;
    if(p.xVelocity === 0){
      p.x += p.joystick[0] * 2.5;
    } else {
      p.x += p.xVelocity;
    }
    p.y += p.yVelocity;
    if(p.y < 0){
      p.y = 0;
      p.isInMidair = false;
      p.yVelocity = 0;
      p.xVelocity = 0;
    }
  }

  return {
    time: Date.now(),
    players: players
  };
}
module.exports.getUpdate = getUpdate;
