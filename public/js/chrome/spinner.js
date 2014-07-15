function spinner(element) {
  'use strict';
  var c = element || document.createElement('canvas');
  if (!c.getContext) {
    return false;
  }
  var ctx = c.getContext('2d');

  var rafID = null;

  c.height = c.width = 11;

  var TORADIAN = Math.PI / 180;
  var w = c.width;
  var h = c.height;
  var deg = 0;
  var r = 4;
  var speed = 4;
  var tailspeed = 1/7;

  ctx.strokeStyle = 'rgba(0,0,0,.5)';
  ctx.lineWidth = 1.5;

  var last = true;
  function draw() {
    rafID = window.requestAnimationFrame(draw);

    deg += speed;

    var start = ((deg * tailspeed)) % 360; // A / TAIL
    var end = deg % 360;              // B / HEAD
    var flip = end === start;

    if (flip) {
      last = !last;
      // this prevents a single blank frame when
      // the start and end have the same value
      start -= 1;
    }

    ctx.fillStyle = '#f9f9f9';
    ctx.strokeStyle = '#111';
    ctx.fillRect(w/2 - r*2, h/2 - r*2, r * 4, r * 4);
    ctx.beginPath();
    ctx.arc(w/2 + 0.5, h/2 + 0.5, r, start * TORADIAN, end * TORADIAN, last);
    ctx.stroke();

    ctx.strokeStyle = '#999';
    ctx.beginPath();
    ctx.arc(w/2 + 0.5, h/2 + 0.5, r, end * TORADIAN, start * TORADIAN, last);
    ctx.stroke();

    ctx.closePath();

  }

  return {
    element: c,
    start: draw,
    stop: function () {
      window.cancelAnimationFrame(rafID);
    }
  };
}