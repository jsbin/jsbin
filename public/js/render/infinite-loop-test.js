function testForHang(callback) {
  var worker = new Worker(jsbin.root + '/js/render/infinite-loop-test-worker.js'),
      timer = null;

  worker.onmessage = function (e) {
    clearTimeout(timer);
    if (e.data.code === 'READY') {
      timer = setTimeout(function () {
        worker.terminate();
        callback(false);
      }, 100);
    } else if (e.data.code === 'DONE') {
      clearTimeout(timer);
      callback(true);  
    } else if (false && e.data.code === 'ERROR') { // ignore errors for now
      clearTimeout(timer);
      callback(false);
    } else {
//      console.log('unexpected response from loop worker');
      callback(true);
    }
    
  };
  worker.postMessage(jsbin.panels.panels.javascript.getCode());
}
