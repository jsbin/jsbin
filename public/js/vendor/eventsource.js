;(function (global) {

if ("EventSource" in global) return;

var reTrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

var EventSource = function (url) {
  var eventsource = this,
      interval = 500, // polling interval
      lastEventId = null,
      cache = '';

  if (!url || typeof url != 'string') {
    throw new SyntaxError('Not enough arguments');
  }

  this.URL = url;
  this.readyState = this.CONNECTING;
  this._pollTimer = null;
  this._xhr = null;

  function pollAgain(xhr) {
    if (xhr.status === 200) {
      eventsource._pollTimer = setTimeout(function () {
        poll.call(eventsource);
      }, interval);
    }
  }

  function poll() {
    try { // force hiding of the error message... insane?
      if (eventsource.readyState == eventsource.CLOSED) return;

      // NOTE: IE7 and upwards support
      var xhr = new XMLHttpRequest();
      xhr.open('GET', eventsource.URL, true);
      xhr.setRequestHeader('Accept', 'text/event-stream');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      // we must make use of this on the server side if we're working with Android - because they don't trigger
      // readychange until the server connection is closed
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      if (lastEventId != null) xhr.setRequestHeader('Last-Event-ID', lastEventId);
      cache = '';

      xhr.timeout = 50000;
      xhr.onreadystatechange = function () {
        var status = 0;
        try {
          status = xhr.status;
        } catch (e) {}

        if ((this.readyState == 3 || this.readyState == 4) && status == 200) {
          // on success
          if (eventsource.readyState == eventsource.CONNECTING) {
            eventsource.readyState = eventsource.OPEN;
            eventsource.dispatchEvent('open', { type: 'open' });
          }

          var responseText = '';
          try {
            responseText = this.responseText || '';
          } catch (e) {}

          // process this.responseText
          var parts = responseText.substr(cache.length).split("\n"),
              eventType = 'message',
              data = [],
              i = 0,
              line = '';

          cache = responseText;

          // TODO handle 'event' (for buffer name), retry
          for (; i < parts.length; i++) {
            line = parts[i].replace(reTrim, '');
            if (line.indexOf('event') == 0) {
              eventType = line.replace(/event:?\s*/, '');
            } else if (line.indexOf('data') == 0) {
              data.push(line.replace(/data:?\s*/, ''));
            } else if (line.indexOf('id:') == 0) {
              lastEventId = line.replace(/id:?\s*/, '');
            } else if (line.indexOf('id') == 0) { // this resets the id
              lastEventId = null;
            } else if (line == '') {
              if (data.length) {
                var event = new MessageEvent(data.join('\n'), eventsource.url, lastEventId);
                eventsource.dispatchEvent(eventType, event);
                data = [];
                eventType = 'message';
              }
            }
          }

          if (this.readyState == 4) pollAgain(this);
          // don't need to poll again, because we're long-loading
        } else if (eventsource.readyState !== eventsource.CLOSED) {
          if (this.readyState == 4) { // and some other status
            // dispatch error
            eventsource.readyState = eventsource.CONNECTING;
            eventsource.dispatchEvent('error', { type: 'error' });
            pollAgain(this);
          } else if (this.readyState == 0) { // likely aborted
            pollAgain(this);
          } else {
          }
        }
      };

      xhr.send();

      setTimeout(function () {
        if (true || xhr.readyState == 3) xhr.abort();
      }, xhr.timeout);

      eventsource._xhr = xhr;

    } catch (e) { // in an attempt to silence the errors
      eventsource.dispatchEvent('error', { type: 'error', data: e.message }); // ???
    }
  };

  poll(); // init now
};

EventSource.prototype = {
  close: function () {
    // closes the connection - disabling the polling
    this.readyState = this.CLOSED;
    clearInterval(this._pollTimer);
    this._xhr.abort();
  },
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2,
  dispatchEvent: function (type, event) {
    var handlers = this['_' + type + 'Handlers'];
    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(this, event);
      }
    }

    if (this['on' + type]) {
      this['on' + type].call(this, event);
    }
  },
  addEventListener: function (type, handler) {
    if (!this['_' + type + 'Handlers']) {
      this['_' + type + 'Handlers'] = [];
    }

    this['_' + type + 'Handlers'].push(handler);
  },
  removeEventListener: function () {
    // TODO
  },
  onerror: null,
  onmessage: null,
  onopen: null,
  readyState: 0,
  URL: ''
};

var MessageEvent = function (data, origin, lastEventId) {
  this.data = data;
  this.origin = origin;
  this.lastEventId = lastEventId || '';
};

MessageEvent.prototype = {
  data: null,
  type: 'message',
  lastEventId: '',
  origin: ''
};

if ('module' in global) module.exports = EventSource;
global.EventSource = EventSource;

})(this);
