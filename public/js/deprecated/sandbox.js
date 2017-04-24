function Queue(processor) {
  this.queue = [];
  this.isReady = false;
  this.processor = processor;
}

Queue.prototype = {
  ready: function () {
    if (!this.isReady) {
      this.isReady = true;
      this.queue.forEach(this.processor);
    }
  },
  push: function (data) {
    if (this.isReady) {
      this.processor(data);
    } else {
      this.queue.push(data);
    }
  }
};

function Sandbox(url) {
  function send(data) {
    source.postMessage(data, frameHost);
  }

  var iframe = document.createElement('iframe');
      frameHost = location.origin,
      iframe.src = jsbin.root + '/sandbox.html?' + url,
      body = document.body,
      source = null,
      guid = +new Date,
      callbacks = {},
      queue = new Queue(send);

  iframe.style.display = 'none';
  body.appendChild(iframe);

  window.addEventListener('message', function (event) {
    var result;

    if (event.origin === frameHost) {
      if (event.data === '__pong__') {
        source = event.source;
        queue.ready();
      } else {
        result = JSON.parse(event.data);
        if (callbacks[result.guid]) {
          callbacks[result.guid](result.data);
        }
      }
    }
  }, false);

  iframe.onload = function () {
    iframe.contentWindow.postMessage('__ping__', frameHost);
  };

  return {
    get: function (what, callback) {
      guid++;
      callbacks[guid] = callback;
      queue.push(JSON.stringify({ guid: guid, what: what }));
    }
  }
}