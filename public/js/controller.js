'use strict';

var socket = io('/controller');
var clientInfo = {};
var gameInfo = {};

socket.on('client-info', function(p, g){
  console.log('connected! :D');
  clientInfo = p;
  gameInfo = g;
  document.body.style.backgroundColor = p.color;
});

var topBtn = document.getElementById('top');
var bottomBtn = document.getElementById('bottom');

topBtn.addEventListener('touchstart', function(){
  socket.emit('button-down', 0);
});
topBtn.addEventListener('touchend', function(){
  socket.emit('button-up', 0);
});
bottomBtn.addEventListener('touchstart', function(){
  socket.emit('button-down', 1);
});
bottomBtn.addEventListener('touchend', function(){
  socket.emit('button-up', 1);
});
