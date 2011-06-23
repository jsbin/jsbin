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
  
  this.home = function (name) {
    jsbin.settings.home = name; // will save later
    
    // cookie is required to share with the server so we can do a redirect on new bin
    var date = new Date();
		date.setTime(date.getTime()+(365*24*60*60*1000)); // set for a year
    document.cookie = 'home=' + name + '; expires=' + date.toGMTString() + ' path=/';
    
    if (location.pathname == '/') {
      location.reload();
    }
  };
  
  //= require "stream"  
}).call(jsbin);