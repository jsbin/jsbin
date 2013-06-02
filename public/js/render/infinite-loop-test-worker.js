this.addEventListener('message', function(e) {
  this.postMessage(1);
  setTimeout(function () {
    try {
      eval(e.data);  
    } catch (e) {}
    
    this.postMessage(2);
  }, 10);
}, false);