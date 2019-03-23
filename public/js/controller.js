'use strict';

var socket = io('/', {query: 'type=controller'});
var clientInfo = {};

socket.on('client-info', function(p){
  console.log('connected! :D');
  clientInfo = p;
  document.body.style.backgroundColor = p.color;
});
