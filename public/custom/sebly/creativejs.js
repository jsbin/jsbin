// canvas augmentation!

var p = CanvasRenderingContext2D.prototype;
p.circle = function(x, y, radius) { 
  this.beginPath(); 
  this.arc(x, y, radius, 0, Math.PI*2, true); 
};
p.fillCircle = function(x, y, radius) { 
  this.circle(x, y, radius); 
  this.fill(); 
};
p.strokeCircle = function(x, y, radius) { 
  this.circle(x, y, radius); 
  this.stroke(); 
};
p.ellipse = function(x, y, width, height) { 
  this.beginPath(); 
  for(var i=0;i<Math.PI*2;i+=Math.PI/16) { 
    this.lineTo(x+(Math.cos(i)*width/2), y+(Math.sin(i)*height/2));
    
  }
  this.closePath(); 
};
p.fillEllipse = function(x, y, width, height) { 
  this.ellipse(x,y,width, height); 
  this.fill(); 
};
p.strokeEllipse = function(x, y, width, height) { 
  this.ellipse(x,y,width, height); 
  this.stroke(); 
};

p.line = function (x1, y1, x2, y2){
  this.beginPath(); 
  this.moveTo(x1,y1); 
  this.lineTo(x2,y2); 
  this.stroke(); 
};

function radians(deg) {return deg*Math.PI/180;}; 
function degrees(rad) {return rad*180/Math.PI;};

function randomInteger(min, max) {
  if(max===undefined) {
    max = min; 
    min = 0; 
  }
  return Math.floor(Math.random() * (max+1-min)) +min;
}
function random(min, max) { 
  if(min===undefined) { 
    min = 0; 
    max = 1; 
  } else if(max=== undefined) { 
    max = min; 
    min = 0; 
  }
  return (Math.random() * (max-min)) + min;
};

function map(value, min1, max1, min2, max2, clampResult) { 
  var returnvalue = ((value-min1) / (max1 - min1) * (max2-min2)) + min2; 
  if(clampResult) return clamp(returnvalue, min2, max2); 
  else return returnvalue; 
};

function clamp(value, min, max) { 
  if(max<min) { 
    var temp = min; 
    min = max; 
    max = temp; 
    
  }
  return Math.max(min, Math.min(value, max)); 
};

function dist(x1, y1, x2, y2) { 
  x2-=x1; y2-=y1; 
  return Math.sqrt((x2*x2) + (y2*y2)); 
}



var mouseX = 0, 
  mouseY = 0, 
  lastMouseX = 0, 
  lastMouseY = 0, 
  frameRate = 60, 
  lastUpdate = Date.now(),
  mouseDown = false;

function cjsloop() {
  //console.log("cjsloop",this); 
  var now = Date.now(); 
  var elapsedMils = now - lastUpdate; 
  
  requestAnimationFrame(cjsloop);

  if((typeof window.draw == 'function') && (elapsedMils>=(1000/this.frameRate))) {
    window.draw(); 
    
    lastUpdate = now; 
    lastMouseX = mouseX; 
    lastMouseY = mouseY;     
  }
  

};

document.body.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
  
document.body.addEventListener('mousedown', function(e){mouseDown =true; if(typeof onMouseDown == 'function') onMouseDown() ;});
document.body.addEventListener('mouseup', function(e){mouseDown = false;if(typeof onMouseUp == 'function') onMouseDown()  ;});
document.body.addEventListener('keydown', function(e){if(typeof onKeyDown == 'function') onKeyDown(e)  ;});
  


// requestAnimationFrame 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


window.addEventListener('load',cjsloop);