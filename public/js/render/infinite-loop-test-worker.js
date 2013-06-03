// fake objects to help detect those infinite loops
var noop = function () {};
var document = {
      createElement: function () {
        return document;
      },
      appendChild: noop,
      addEventListener: noop
    },
    alert = noop,
    console = {
      log: noop,
      dir: noop
    },
    window = {
      document: document,
      console: console
    };
  
  
this.addEventListener('message', function(e) {
  this.postMessage({ code: 'READY' });
  setTimeout(function () {
    try {
      eval(e.data);
    } catch (e) {
      this.postMessage({ code: 'ERROR', msg: e.toString() }); // 3 is excpetion and don't run
      return;
    }
    
      this.postMessage({ code: 'DONE' });
  }, 10);
}, false);