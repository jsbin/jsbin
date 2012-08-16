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
};

function error(error, cmd) {
  var msg = JSON.stringify({ response: error.message, cmd: cmd, type: 'error' });
  if (remoteWindow) {
    remoteWindow.postMessage(msg, origin);
  } else {
    queue.push(msg);
  }
}

function restore() {
  var data = {},
      rawData = useSS ? sessionStorage.spike : window.name,
      scroll;

  if ((!useSS && window.name == 1) || !rawData) return;

  try {
    // sketchy I know, but doesn't rely on native json support which might be a problem in old mobiles
    eval('data = ' + rawData);

    addEvent('load', function () {
      //console.log('scrolling to', data.y);
      window.scrollTo(data.x, data.y);
    });
  } catch (e) {}
}

function reload() {
  var data = stringify({ y: window.scrollY, x: window.scrollX });

  try {
    // trigger load
    if (useSS) {
      sessionStorage.spike = data;
    } else {
      window.name = data;
    }
    window.location.reload();
  } catch (e) {}
}

function renderStream() {
  es.addEventListener('css', function (event) {
    var style = document.getElementById('jsbin-css');

    if (style.styleSheet) {
      style.styleSheet.cssText = event.data;
    } else {
      style.innerHTML = event.data;
    }
  });

  es.addEventListener('reload', reload);
  es.addEventListener('javascript', reload);
  es.addEventListener('html', function (event) {
    // if the contents of the head has changed, reload,
    // if it's the body, inject
    // document.getElementById('jsbin-css').innerHTML = event.data;
    reload();
  });
}

function codecastStream() {
  var editors = jsbin.panels.panels;

  function setCode(event) {
    var panelId = event.type;
    editors[panelId].setCode(event.data);

    if (panelId !== 'javascript') {

    }
  }

  // on data, update the panels, which will cause an automatic render
  es.addEventListener('css', setCode);
  es.addEventListener('javascript', setCode);
  es.addEventListener('html', setCode);


}

var id = location.pathname.replace(/\/preview.*$/, '').replace(/\/edit.*$/, '').replace(/\/watch.*$/, ''),
    codecasting = location.pathname.indexOf('/watch') !== -1;
    queue = [],
    msgType = '',
    useSS = false,
    es = null;

setTimeout(function () {
  es = new EventSource(id + '?' + Math.random());
  if (codecasting) {
    codecastStream();
  } else {
    renderStream();
  }
}, 500);

try {
  sessionStorage.getItem('foo');
  useSS = true;
} catch (e) {}


if (!codecasting) {
  addEvent('error', function (event) {
    error({ message: event.message }, event.filename + ':' + event.lineno);
  });

  restore();
}

}());
