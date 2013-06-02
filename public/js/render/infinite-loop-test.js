function testForHang(callback) {
  var worker = new Worker(jsbin.root + '/js/render/infinite-loop-test-worker.js'),
      timer = null;
  worker.onmessage = function (e) {
    if (e.data === 1) {
      timer = setTimeout(function () {
        worker.terminate();
        callback(false);
      }, 100);
    } else if (e.data === 2) {
      clearTimeout(timer);
      callback(true);  
    } else {
      console.log('unexpected response from loop worker');
    }
    
  };
  worker.postMessage(jsbin.panels.panels.javascript.getCode());
}
