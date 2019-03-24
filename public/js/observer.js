'use strict';

var socket = io('/observer');

var canvas = document.getElementById('display'),
    ctx = canvas.getContext('2d');

// get maximum possible size for canvas while maintining aspect ratio
function resizeEventHandler(){
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  if(w / canvas.width > h / canvas.height){
    canvas.style.width = 'calc(' + canvas.width + ' / ' + canvas.height + ' * 100vh)';
    canvas.style.height = '100vh';
  } else {
    canvas.style.width = '100vw';
    canvas.style.height = 'calc(' + canvas.height + ' / ' + canvas.width + ' * 100vw)';
  }
}
resizeEventHandler();
window.addEventListener('resize', resizeEventHandler);

// update loop
socket.on('update', function(data){
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  for(var i in data.players){
    var p = data.players[i];

    drawCircle(p.x + canvas.width/2, -p.y + canvas.height/2, 30, p.color);
  }

});

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
