'use strict';

var socket = io('/controller');
var clientInfo = {};
var gameInfo = {};

// fullscreen and landscape
document.body.requestFullscreen();
screen.orientation.lock('landscape');

var canvas = document.getElementById('joystick'),
    ctx = canvas.getContext('2d');

// maintain joystick aspect ratio
function resizeEventHandler(){
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeEventHandler();
window.addEventListener('resize', resizeEventHandler);

socket.on('client-info', function(p, g){
  console.log('connected! :D');
  clientInfo = p;
  gameInfo = g;
  document.body.style.backgroundColor = p.color;
});

var topBtn = document.getElementById('top');
var bottomBtn = document.getElementById('bottom');
var joystick = document.getElementById('joystick');
var joystickPressed = false;

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
joystick.addEventListener('touchstart', function(e){
  joystickPressed = true;
  updateJoystick(e);
});
joystick.addEventListener('touchend', function(e){
  joystickPressed = false;
  updateJoystick(e);
});
joystick.addEventListener('touchmove', updateJoystick);

// handles joystick visuals and server communication
var joystickPosition = {x: 0, y: 0};
function updateJoystick(e){
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
  drawCircle(canvas.width/2, canvas.height/2, canvas.width/4, 'rgba(255, 255, 255, 0.5)');

  if(!joystickPressed){
    joystickPosition.x = 0;
    joystickPosition.y = 0;
  } else {
    var rect = canvas.getBoundingClientRect();
    joystickPosition.x = e.touches[0].clientX - canvas.width/2;
    joystickPosition.y = e.touches[0].clientY - canvas.height/2;
  }

  // prevent joystick from leaving circle
  var distance = Math.sqrt(Math.pow(joystickPosition.x, 2) + Math.pow(joystickPosition.y, 2));
  if(distance > canvas.width/5.5){
    var f = (canvas.width/5.5) / distance;
    joystickPosition.x *= f;
    joystickPosition.y *= f;
  }

  drawCircle(canvas.width/2 + joystickPosition.x, canvas.height/2 + joystickPosition.y, canvas.width/12, '#ffffff');


  // after circle is drawn, repurpose joystick position x to send from -2 to 2 to server
  if(joystickPressed && Math.abs(joystickPosition.x) > canvas.width/20){
    if(joystickPosition.x > 0){
      joystickPosition.x = joystickPosition.x > canvas.width/6 ? 2 : 1;
    } else {
      joystickPosition.x = joystickPosition.x < -canvas.width/6 ? -2 : -1;
    }
  } else {
    joystickPosition.x = 0;
  }
  socket.emit('joystick-update', [joystickPosition.x, 0]);
}
updateJoystick();
window.addEventListener('resize', updateJoystick);

function drawCircle(x, y, radius, fillcolor, strokecolor, strokewidth){
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fillStyle = fillcolor;
  ctx.fill();
  if(strokecolor != null){
    ctx.strokeStyle = strokecolor;
    ctx.lineWidth = strokewidth;
    ctx.stroke();
  }
}
