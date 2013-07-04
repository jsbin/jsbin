// This simple script allows the client to take control of the device
// and send a spike to reload the browser.
// http://www.youtube.com/watch?v=mIq9jFdEfZo#t=2m03 "Spike"

/* TASKS

1. Create iframe that sends messages to and from current window
2. On message reload, not before storing some information
3. Need to store current scroll position (and zoom?)
4. Reload

5. Capture error messages and send down spike

6. Report errors via spike (to where?)
7. Create server that allows a spike to be sent to specific id

*/

;(function () {

function sortci(a, b) {
  return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
}

// from console.js
function stringify(o, simple) {
  var json = '', i, type = ({}).toString.call(o), parts = [], names = [];

  if (type == '[object String]') {
    json = '"' + o.replace(/\n/g, '\\n').replace(/"/g, '\\"') + '"';
  } else if (type == '[object Array]') {
    json = '[';
    for (i = 0; i < o.length; i++) {
      parts.push(stringify(o[i], simple));
    }
    json += parts.join(', ') + ']';
    json;
  } else if (type == '[object Object]') {
    json = '{';
    for (i in o) {
      names.push(i);
    }
    names.sort(sortci);
    for (i = 0; i < names.length; i++) {
      parts.push(stringify(names[i]) + ': ' + stringify(o[names[i] ], simple));
    }
    json += parts.join(', ') + '}';
  } else if (type == '[object Number]') {
    json = o+'';
  } else if (type == '[object Boolean]') {
    json = o ? 'true' : 'false';
  } else if (type == '[object Function]') {
    json = o.toString();
  } else if (o === null) {
    json = 'null';
  } else if (o === undefined) {
    json = 'undefined';
  } else if (simple == undefined) {
    json = type + '{\n';
    for (i in o) {
      names.push(i);
    }
    names.sort(sortci);
    for (i = 0; i < names.length; i++) {
      parts.push(names[i] + ': ' + stringify(o[names[i]], true)); // safety from max stack
    }
    json += parts.join(',\n') + '\n}';
  } else {
    try {
      json = o+''; // should look like an object
    } catch (e) {}
  }
  return json;
}

function addEvent(type, fn) {
  window.addEventListener ? window.addEventListener(type, fn, false) : window.attachEvent('on' + type, fn);
}

function cleanPath(str) {
  return (''+str).replace(/[^a-z0-9\/]/g, '');
}

function error(error, cmd) {
  var msg = JSON.stringify({ response: error.message, cmd: cmd, type: 'error' });
  if (remoteWindow) {
    remoteWindow.postMessage(msg, origin);
  } else {
    queue.push(msg);
  }
}

/**
 * Session storage with window.name fallback for the spike.
 */
var store = (function () {
  var useSS;
  // Check to see if sessionStorage is available
  try {
    sessionStorage.getItem('foo');
    useSS = true;
  } catch (e) {}
  return {
    /**
     * Save data to SS or window.name
     */
    set: function (rawData) {
      var data = stringify(rawData);
      if (useSS) {
        sessionStorage.spike = data;
      } else {
        window.name = data;
      }
      return data;
    },
    /**
     * Get data back from SS or window.name
     */
    get: function () {
      var rawData = useSS ? sessionStorage.spike : window.name, data;
      if ((!useSS && window.name == 1) || !rawData) return data;
      try {
        // sketchy, but doesn't rely on native json support which might be a
        // problem in old mobiles
        eval('data = ' + rawData);
      } catch (e) {}
      return data;
    }
  };
}());

/**
 * Restore data from sessionStorage or the window.name when page is reloaded.
 */
function restore() {
  var data = store.get() || {};
  addEvent('load', function () {
    //console.log('scrolling to', data.y);
    window.scrollTo(data.x, data.y);
  });
}

// Save (scroll) data about the current state of the page, and reload it.
function reload(event) {
  store.set({
    y: window.scrollY,
    x: window.scrollX
  });
  window.location.reload();
}

/**
 * Manage the render stream. Wait for processed versions of the author's code,
 * and either reload of inject the new code (CSS).
 */
function renderStream() {
  es.addEventListener('css:processed', function (event) {
    // Inject the CSS
    var style = document.getElementById('jsbin-css');
    if (style.styleSheet) {
      style.styleSheet.cssText = event.data;
    } else {
      style.innerHTML = event.data;
    }
  });

  es.addEventListener('reload', reload);
  // Update the url when the revision is bumped
  es.addEventListener('bump-revision', function (event) {
    window.location.pathname = cleanPath(event.data);
  });
  // Javascript and HTML cause a reload. Would be nice to make it possible to
  // inject HTML changes in future.
  es.addEventListener('javascript:processed', reload);
  es.addEventListener('html:processed', reload);
}

/**
 * Manage the codecasting stream. Wait for code events (for each panel) then
 * update the appropriate panel
 */
function codecastStream() {
  if (!(jsbin && jsbin.panels && jsbin.panels.panels)) return;
  var editors = jsbin.panels.panels;

  function setCode(event) {
    var panelId = event.type;
    if (!editors[panelId]) return;
    editors[panelId].setCode(event.data);
  }

  // Update the url when the revision is bumped
  es.addEventListener('bump-revision', function (event) {
    window.location.pathname = cleanPath(event.data) + '/watch';
  });
  // on data, update the panels, which will cause an automatic render
  es.addEventListener('css', setCode);
  es.addEventListener('javascript', setCode);
  es.addEventListener('html', setCode);
}

/**
 * Spike
 */

var id = location.pathname.replace(/\/(preview|edit|watch).*$/, ''),
    codecasting = location.pathname.indexOf('/watch') !== -1;
    queue = [],
    msgType = '',
    useSS = false,
    es = null;

// Wait for a bit, then set up the EventSource stream
setTimeout(function () {
  es = new EventSource(id + '?' + Math.random());
  if (codecasting) {
    codecastStream();
  } else {
    renderStream();
  }
  es.addEventListener('stats', function () {
    // Could handle stats events here
  });
}, 500);

// If this is the render stream, restore data from before the last reload if
// it's there.
if (!codecasting) {
  addEvent('error', function (event) {
    error({ message: event.message }, event.filename + ':' + event.lineno);
  });

  restore();
}

}());
