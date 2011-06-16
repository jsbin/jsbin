// once these features are live, they come out of the jsbin beta box
(function () {  
  var $body = $('body');
  
  this.on = function () {
    localStorage.setItem('beta', 'true');
    $body.addClass('beta');
  };
  
  this.off = function () {
    localStorage.removeItem('beta');
    $body.removeClass('beta');
  };

  this.active = localStorage.getItem('beta') == 'true' || false;
  if (this.active) this.on();
  
  //= require "stream"  
}).call(jsbin);