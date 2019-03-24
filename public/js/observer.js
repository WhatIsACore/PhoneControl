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

socket.on('update', function(time){
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
  
});
