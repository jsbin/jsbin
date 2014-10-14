var jsconsole = (function (window) {

// Key-code library
var keylib={left:37,up:38,right:39,down:40,space:32,
            alt:18,ctrl:17,shift:16,tab:9,enter:13,webkitEnter:10,
            escape:27,backspace:8,
            zero:48,one:49, two:50,three:51,four:52,
            five:53,six:57,seven:58,eight:59,nine:60,
            a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,
            l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,
            w:87,x:88,y:89,z:90};

function cleanse(s) {
  return (s||'').replace(/[<&]/g, function (m) { return {'&':'&amp;','<':'&lt;'}[m];});
}

var historyPosition = -1;

/**
 * Run a console command.
 */
var run = function (cmd, cb) {
  var internalCmd = internalCommand(cmd);
  if (internalCmd) {
    return cb(['info', internalCmd]);
  }
  $document.trigger('console:run', cmd);
};

/**
 * Run and show response to a command fired from the console
 */
var post = function (cmd, blind, response) {
  var toecho = '';
  if (typeof cmd !== 'string') {
    toecho = cmd.echo;
    blind = cmd.blind;
    response = cmd.response;
    cmd = cmd.cmd;
  } else {
    toecho = cmd;
  }

  cmd = trim(cmd);

  // Add the command to the user's history – unless this was blind
  if (!blind) {
    history.push(cmd.trim());
    setHistory(history);
  }

  // Show the user what they typed
  echo(toecho.trim());

  // If we were handed a response, show the response straight away – otherwise
  // runs it
  if (response) return showResponse(response);
  run(cmd, showResponse);

  setCursorTo('');

};

/**
 * Display the result of a command to the user
 */
var showResponse = function (response) {

  // order so it appears at the top
  var el = document.createElement('div'),
      li = document.createElement('li'),
      span = document.createElement('span'),
      parent = output.parentNode;

  historyPosition = history.length;

  if (typeof response === 'undefined') return;

  el.className = 'response';
  span.innerHTML = response[1];

  if (response[0] != 'info') prettyPrint([span]);
  el.appendChild(span);

  li.className = response[0];
  li.innerHTML = '<span class="gutter"></span>';
  li.appendChild(el);

  appendLog(li);

  exec.value = '';
  if (enableCC) {
    try {
      if (jsbin.panels && jsbin.panels.focused.id === 'console') {
        if (!jsbin.embed) {
          getCursor().focus();
        }
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
      }
    } catch (e) {}
  }

};

function log(msg, className) {
  var li = document.createElement('li'),
      div = document.createElement('div');

  div.innerHTML = msg;
  prettyPrint([div]);
  li.className = className || 'log';
  li.innerHTML = '<span class="gutter"></span>';
  li.appendChild(div);

  appendLog(li);
}

function echo(cmd) {
  var li = document.createElement('li');

  li.className = 'echo';
  li.innerHTML = '<span class="gutter"></span><div>' + cleanse(cmd) + '</div>';

  logAfter = null;

  // logAfter = $(output).find('li.echo:first')[0] || null;

  // logAfter = output.querySelector('li.echo') || null;
  appendLog(li, true);
}

window.info = function(cmd) {
  var li = document.createElement('li');

  li.className = 'info';
  li.innerHTML = '<span class="gutter"></span><div>' + cleanse(cmd) + '</div>';

  // logAfter = output.querySelector('li.echo') || null;
  // appendLog(li, true);
  appendLog(li);
};

function appendLog(el, echo) {
  output.appendChild(el);
  output.parentNode.scrollTop = output.parentNode.scrollHeight + 1000;
  return;

  if (echo) {
    if (!output.firstChild) {
      output.appendChild(el);
    } else {
      output.insertBefore(el, output.firstChild);
    }
  } else {
    if (!output.lastChild) {
      output.appendChild(el);
    } else {
      // console.log(output.lastChild.nextSibling);
      output.insertBefore(el, logAfter ? logAfter : output.lastChild.nextSibling); //  ? output.lastChild.nextSibling : output.firstChild
    }
  }
}

function internalCommand(cmd) {
  var parts = [], c;
  if (cmd.substr(0, 1) == ':') {
    parts = cmd.substr(1).split(' ');
    c = parts.shift();
    return (commands[c] || noop).apply(this, parts);
  }
}

function noop() {}

function showhelp() {
  var commands = [
    ':reset - destroy state and start afresh',
    ':history - list current session history',
    ':load &lt;url&gt; - to inject new DOM',
    ':load &lt;script_url&gt; - to inject external library',
    '      load also supports following shortcuts: <br />      jquery, underscore, prototype, mootools, dojo, rightjs, coffeescript, yui.<br />      eg. :load jquery',
    ':clear - to clear contents of the console',
    ':about jsconsole'
  ];
  return commands.join('\n');
}

/**
 * Handle loading scripts and DOM into dynamic iframe with event listeners
 */
var load = (function () {

  $document.on('console:load:script:error', function (event, err) {
    showResponse(['error', err]);
  });

  $document.on('console:load:script:success', function (event, url) {
    showResponse(['response', 'Loaded "' + url + '"']);
  });

  $document.on('console:load:dom:error', function (event, err) {
    showResponse(['error', err]);
  });

  $document.on('console:load:dom:success', function (event, url) {
    showResponse(['response', 'Loaded DOM.']);
  });

  return function (url) {
    if (navigator.onLine) {
      if (arguments.length > 1 || libraries[url] || url.indexOf('.js') !== -1) {
        return loadScript.apply(this, arguments);
      } else {
        return loadDOM(url);
      }
    } else {
      return "You need to be online to use :load";
    }
  }
}());

function loadScript() {
  for (var i = 0; i < arguments.length; i++) {
    (function (url) {
      $document.trigger('console:load:script', url);
    })(libraries[arguments[i]] || arguments[i]);
  }
  return "Loading script...";
}

function loadDOM(url) {
  var script = document.createElement('script'),
      cb = 'loadDOM' + +new Date;

  script.src = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + encodeURIComponent(url) + '%22&format=xml&callback=' + cb;

  window[cb] = function (yql) {
    if (yql.results.length) {
      var html = yql.results[0].replace(/type="text\/javascript"/ig,'type="x"').replace(/<body.*?>/, '').replace(/<\/body>/, '');

      $document.trigger('console:load:dom', html);
    } else {
      log('Failed to load DOM', 'error');
    }
    try {
      window[cb] = null;
      delete window[cb];
    } catch (e) {}

  };

  document.body.appendChild(script);

  return "Loading URL into DOM...";
}

function trim(s) {
  return (s||"").replace(/^\s+|\s+$/g,"");
}

var ccCache = {};
var ccPosition = false;

window._console = {
  clear: function () {
    output.innerHTML = '';
  },
  log: function () {
    var l = arguments.length, i = 0;
    for (; i < l; i++) {
      log(''+arguments[i], true);
    }
  },
  dir: function () {
    var l = arguments.length, i = 0;
    for (; i < l; i++) {
      log(arguments[i]);
    }
  },
  props: function (obj) {
    var props = [], realObj;
    try {
      for (var p in obj) props.push(p);
    } catch (e) {}
    return props;
  },
  error: function (err) {
    log(err.message || err, 'error');
  }
};

// give info support too
window._console.info = window._console.log;

function about() {
  return 'Ported to JS Bin from <a target="_new" href="http://jsconsole.com">jsconsole.com</a>';
}

function setHistory(history) {
  historyPosition = history.length;
  if (typeof JSON == 'undefined') return;

  try {
    // because FF with cookies disabled goes nuts, and because sometimes WebKit goes nuts too...
    sessionStorage.setItem('history', JSON.stringify(history));
  } catch (e) {}
}

function getHistory() {
  var history = [''];

  if (typeof JSON == 'undefined') return history;

  try {
    // because FF with cookies disabled goes nuts, and because sometimes WebKit goes nuts too...
    history = JSON.parse(sessionStorage.getItem('history') || '[""]');
  } catch (e) {}
  return history;
}

function showHistory() {
  var h = getHistory();
  h.shift();
  return h.join("\n");
}

var exec = document.getElementById('exec'),
    form = exec.form || {},
    output = null,
    history = getHistory(),
    fakeConsole = 'window.parent._console',
    libraries = {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
        prototype: 'http://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
        dojo: 'http://ajax.googleapis.com/ajax/libs/dojo/1/dojo/dojo.xd.js',
        mootools: 'http://ajax.googleapis.com/ajax/libs/mootools/1/mootools-yui-compressed.js',
        underscore: 'http://jashkenas.github.io/underscore/underscore-min.js',
        rightjs: 'http://rightjs.org/hotlink/right.js',
        coffeescript: 'http://jashkenas.github.io/coffee-script/extras/coffee-script.js',
        yui: 'http://yui.yahooapis.com/3.9.1/build/yui/yui-min.js'
    },
    body = document.getElementsByTagName('body')[0],
    logAfter = null,
    lastCmd = null,
    wait = false,
    commandPresent = /:((?:help|about|load|clear|reset|wait|history)(?:.*))\n/gi,
    commands = {
      history: showHistory,
      help: showhelp,
      about: about,
      load: load,
      wait: function () {
        wait = true;
        return '';
      },
      clear: function () {
        setTimeout(function () { output.innerHTML = ''; }, 10);
        return 'clearing...';
      },
      reset: function () {
        output.innerHTML = '';
        jsconsole.init(output, true);
        return 'Context reset';
      }
    },
    fakeInput = null,
    getCursor = (function () {
      var cursor;
      return function () {
        if (cursor) return cursor;
        return document.getElementById('cursor') || { focus: function () {} };
      };
    }()),
    // I hate that I'm browser sniffing, but there's issues with Firefox and execCommand so code completion won't work
    iOSMobile = navigator.userAgent.indexOf('AppleWebKit') !== -1 && navigator.userAgent.indexOf('Mobile') !== -1,
    // FIXME Remy, seriously, don't sniff the agent like this, it'll bite you in the arse.
    enableCC = navigator.userAgent.indexOf('AppleWebKit') !== -1 && navigator.userAgent.indexOf('Mobile') === -1 || navigator.userAgent.indexOf('OS 5_') !== -1;

if (enableCC) {
  var autofocus = jsbin.embed ? '' : 'autofocus';
  exec.parentNode.innerHTML = '<div ' + autofocus + ' id="exec" autocapitalize="off" spellcheck="false"><span id="cursor" spellcheck="false" autocapitalize="off" autocorrect="off"' + (iOSMobile ? '' : ' contenteditable') + '></span></div>';
  exec = document.getElementById('exec');
} else {
  $('#console').addClass('plain');
}

if (enableCC && iOSMobile) {
  fakeInput = document.createElement('input');
  fakeInput.className = 'fakeInput';
  fakeInput.setAttribute('spellcheck', 'false');
  fakeInput.setAttribute('autocorrect', 'off');
  fakeInput.setAttribute('autocapitalize', 'off');
  exec.parentNode.appendChild(fakeInput);
}

function whichKey(event) {
  var keys = {38:1, 40:1, Up:38, Down:40, Enter:10, 'U+0009':9, 'U+0008':8, 'U+0190':190, 'Right':39,
      // these two are ignored
      'U+0028': 57, 'U+0026': 55 };
  return keys[event.keyIdentifier] || event.which || event.keyCode;
}

function setCursorTo(str) {
  str = enableCC ? cleanse(str) : str;
  var old = exec.value;
  exec.value = str;

  if (enableCC) {
    if (exec.textContent.length) {
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);
    }
    document.execCommand('insertHTML', false, str);
    getCursor().focus();
  } else {
    var rows = str.match(/\n/g);
    exec.setAttribute('rows', rows !== null ? rows.length + 1 : 1);
  }
}

function findNode(list, node) {
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i] == node) {
      return pos;
    }
    pos += list[i].nodeValue.length;
  }
  return -1;
};

/**
 * Handle keydown events in the console - the money shot.
 */
exec.onkeydown = function (event) {
  event = event || window.event;
  var keys = {38:1, 40:1},
      wide = body.className == 'large',
      which = whichKey(event),
      enterDown = (which == keylib.enter || which == keylib.webkitEnter);

  if (typeof which == 'string') which = which.replace(/\/U\+/, '\\u');
  // Is this a special key?
  if (keys[which]) {
    if (event.shiftKey) return;
    // History cycle

    // Up
    if (which == keylib.up) {
      historyPosition--;
      // Don't go past the start
      if (historyPosition < 0) historyPosition = 0; //history.length - 1;
    }
    // Down
    if (which == keylib.down) {
      historyPosition++;
      // Don't go past the end
      if (historyPosition >= history.length) historyPosition = history.length; //0;
    }
    if (history[historyPosition] != undefined && history[historyPosition] !== '') {
      setCursorTo(history[historyPosition]);
      return false;
    } else if (historyPosition == history.length) {
      setCursorTo('');
      return false;
    }
  }

  // Execute the code
  else if (enterDown && event.shiftKey == false) { // enter (what about the other one)
    var command = exec.textContent || exec.value;
    // ======================================================================
    if (command.length) post(command);
    // ======================================================================
    return false;
  }

  // Expand the textarea
  else if (enterDown && event.shiftKey == true) {
    var rows = exec.value.match(/\n/g);
    rows = rows != null ? rows.length + 2 : 2;
    exec.setAttribute('rows', rows);
  }

  // Clear the console.
  // Ctrl+L or Meta+Shift+Backspace
  else if ((event.shiftKey && event.metaKey && which == keylib.backspace) ||
           (event.ctrlKey && which == keylib.l)) {
    output.innerHTML = '';
  }
};

if (enableCC && iOSMobile) {
  fakeInput.onkeydown = function (event) {
    var which = whichKey(event),
        enterDown = (which == keylib.enter || which == keylib.webkitEnter)

    if (enterDown) {
      post(this.value);
      this.value = '';
      getCursor().innerHTML = '';
      return false;
    }
  };
}

form.onsubmit = function (event) {
  event = event || window.event;
  event.preventDefault && event.preventDefault();
  post(exec.textContent || exec.value);
  return false;
};

document.onkeydown = function (event) {
  event = event || window.event;
  var which = event.which || event.keyCode;

  if (event.shiftKey && event.metaKey && which == 8) {
    output.innerHTML = '';
    getCursor().focus();
  } else if (event.target == output.parentNode && which == 32) { // space
    output.parentNode.scrollTop += 5 + output.parentNode.offsetHeight * (event.shiftKey ? -1 : 1);
  }
};

exec.onclick = function () {
  getCursor().focus();
};

var jsconsole = {
  run: post,
  clear: commands.clear,
  reset: function () {
    this.run(':reset');
  },
  focus: function () {
    if (enableCC) {
      getCursor().focus();
    } else {
      $(exec).focus();
    }
  },
  echo: echo,
  _onloadQueue: [],
  onload: function (fn) {
    var i = 0, length = this._onloadQueue.length;
    if (this.ready === false && fn) { // if not ready and callback passed - cache it
      this._onloadQueue.push(fn);
    } else if (this.ready === true && !fn) { // if ready and not callback - flush cache
      for (; i < length; i++) {
        this._onloadQueue[i].call(this);
      }
      this._onloadQueue = [];
    } else if (fn) { // if callback and ready - run callback
      fn.call(this);
    }
  },
  init: function (outputElement, nohelp) {
    output = outputElement;

    jsconsole.ready = true;
    jsconsole.onload();

    if (nohelp === undefined) post(':help', true);
  },
  rawMessage: function (data) {
    if (data.type && data.type == 'error') {
      post(data.cmd, true, ['error', data.response]);
    } else if (data.type && data.type == 'info') {
      window.top.info(data.response);
    } else {
      if (data.cmd.indexOf('console.log') === -1) data.response = data.response.substr(1, data.response.length - 2); // fiddle to remove the [] around the repsonse
      echo(data.cmd);
      log(data.response, 'response');
    }
  }
};

return jsconsole;

})(this);

var msgType = '';

jsconsole.init(document.getElementById('output'));

function upgradeConsolePanel(console) {
    console.$el.click(function (event) {
      if (!$(event.target).closest('#output').length) {
        jsconsole.focus();
      }
    });
    console.reset = function () {
      jsconsole.reset();
    };
    console.settings.render = function (withAlerts) {
      var html = editors.html.getCode().trim();
      if (html === "") {
        editors.javascript.render().then(function (echo) {
          echo = echo.trim();
          return getPreparedCode().then(function (code) {
            code = code.replace(/<pre>/, '').replace(/<\/pre>/, '');

            setTimeout(function() {
              jsconsole.run({
                echo: echo,
                cmd: code
              });
            }, 0);
          });
        }, function (error) {
          console.warn('Failed to render JavaScript');
          console.warn(error);
        });

        // Tell the iframe to reload
        renderer.postMessage('render', {
          source: '<html>'
        });
      } else {
        renderLivePreview(withAlerts || false);
      }
    };
    console.settings.show = function () {
      jsconsole.clear();
      // renderLivePreview(true);
      // setTimeout because the renderLivePreview creates the iframe after a timeout
      setTimeout(function () {
        if (editors.console.ready && !jsbin.embed) jsconsole.focus();
      }, 0);
    };
    console.settings.hide = function () {
      // Removal code is commented out so that the
      // output iframe is never removed
      if (!editors.live.visible) {
        // $live.find('iframe').remove();
      }
    };

    $document.one('jsbinReady', function () {
      var hidebutton = function () {
        $('#runconsole')[this.visible ? 'hide' : 'show']();
      };

      jsbin.panels.panels.live.on('show', hidebutton).on('hide', hidebutton);

      if (jsbin.panels.panels.live.visible) {
        $('#runconsole').hide();
      }

    });
}
