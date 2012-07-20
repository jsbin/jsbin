//= require "../vendor/prettyprint"
//= require "../vendor/stacktrace"

var jsconsole = (function (window) {

function sortci(a, b) {
  return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
}

// custom because I want to be able to introspect native browser objects *and* functions
function stringify(o, simple, visited) {
  var json = '', i, vi, type = '', parts = [], names = [], circular = false;
  visited = visited || [];
  
  try {
    type = ({}).toString.call(o);
  } catch (e) { // only happens when typeof is protected (...randomly)
    type = '[object Object]';
  }

  // check for circular references
  for (vi = 0; vi < visited.length; vi++) {
    if (o === visited[vi]) {
      circular = true;
      break;
    }
  }

  if (circular) {
    json = '[circular]';
  } else if (type == '[object String]') {
    json = '"' + o.replace(/"/g, '\\"') + '"';
  } else if (type == '[object Array]') {
    visited.push(o);

    json = '[';
    for (i = 0; i < o.length; i++) {
      parts.push(stringify(o[i], simple, visited));
    }
    json += parts.join(', ') + ']';
  } else if (type == '[object Object]') {
    visited.push(o);

    json = '{';
    for (i in o) {
      names.push(i);
    }
    names.sort(sortci);
    for (i = 0; i < names.length; i++) {
      parts.push( stringify(names[i], undefined, visited) + ': ' + stringify(o[ names[i] ], simple, visited) );
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
  } else if (simple === undefined) {
    visited.push(o);

    json = type + '{\n';
    for (i in o) {
      names.push(i);
    }
    names.sort(sortci);
    for (i = 0; i < names.length; i++) {
      try {
        parts.push(names[i] + ': ' + stringify(o[names[i]], true, visited)); // safety from max stack
      } catch (e) {
        if (e.name == 'NS_ERROR_NOT_IMPLEMENTED') {
          // do nothing - not sure it's useful to show this error when the variable is protected
          // parts.push(names[i] + ': NS_ERROR_NOT_IMPLEMENTED');
        }
      }
    }
    json += parts.join(',\n') + '\n}';
  } else {
    try {
      json = stringify(o)+''; // should look like an object
    } catch (e) {

    }
  }
  return json;
}

function cleanse(s) {
  return (s||'').replace(/[<&]/g, function (m) { return {'&':'&amp;','<':'&lt;'}[m];});
}

function run(cmd) {
  var rawoutput = null,
      className = 'response',
      internalCmd = internalCommand(cmd);
  if (internalCmd) {
    return ['info', internalCmd];
  } else {
    try {
      // if ('CoffeeScript' in sandboxframe.contentWindow) cmd = sandboxframe.contentWindow.CoffeeScript.compile(cmd, {bare:true});
      rawoutput = sandboxframe.contentWindow.eval(cmd);
    } catch (e) {
      rawoutput = e.message;
      className = 'error';
    }
    return [className, cleanse(stringify(rawoutput))];
  }
}

function post(cmd, blind, response /* passed in when echoing from remote console */) {
  cmd = trim(cmd);

  if ((cmd.match(commandPresent) || []).length > 1) {
    // split the command up in to blocks and internal commands and run sequentially
  } else {

  }

  echo(cmd);

  // order so it appears at the top
  var el = document.createElement('div'),
      li = document.createElement('li'),
      span = document.createElement('span'),
      parent = output.parentNode;

  response = response || run(cmd);

  if (response !== undefined) {
    el.className = 'response';
    span.innerHTML = response[1];

    if (response[0] != 'info') prettyPrint([span]);
    el.appendChild(span);

    li.className = response[0];
    li.innerHTML = '<span class="gutter"></span>';
    li.appendChild(el);

    appendLog(li);

    output.parentNode.scrollTop = 0;
  }
  pos = history.length;
}

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

  if (output.querySelector) {
    logAfter = output.querySelector('li.echo') || null;
  } else {
    var lis = document.getElementsByTagName('li'),
        len = lis.length,
        i;
    for (i = 0; i < len; i++) {
      if (lis[i].className.indexOf('echo') !== -1) {
        logAfter = lis[i];
        break;
      }
    }
  }

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
    ':load &lt;url&gt; - to inject new DOM',
    ':load &lt;script_url&gt; - to inject external library',
    '      load also supports following shortcuts: <br />      jquery, underscore, prototype, mootools, dojo, rightjs, coffeescript, yui.<br />      eg. :load jquery',
    ':clear - to clear contents of the console',
    ':about'
  ];
  return commands.join('\n');
}

function load(url) {
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

function loadScript() {
  var doc = sandboxframe.contentDocument || sandboxframe.contentWindow.document;
  for (var i = 0; i < arguments.length; i++) {
    (function (url) {
      var script = document.createElement('script');
      script.src = url;
      script.onload = function () {
        window.top.info('Loaded ' + url, 'http://' + window.location.hostname);
        if (url == libraries.coffeescript) window.top.info('Now you can type CoffeeScript instead of plain old JS!');
      };
      script.onerror = function () {
        log('Failed to load ' + url, 'error');
      };
      doc.body.appendChild(script);
    })(libraries[arguments[i]] || arguments[i]);
  }
  return "Loading script...";
}

function loadDOM(url) {
  var doc = sandboxframe.contentWindow.document,
      script = document.createElement('script'),
      cb = 'loadDOM' + +new Date;
      
  script.src = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + encodeURIComponent(url) + '%22&format=xml&callback=' + cb;
  
  window[cb] = function (yql) {
    if (yql.results.length) {
      var html = yql.results[0].replace(/type="text\/javascript"/ig,'type="x"').replace(/<body.*?>/, '').replace(/<\/body>/, '');

      doc.body.innerHTML = html;
      window.top.info('DOM load complete');
    } else {
      log('Failed to load DOM', 'error');
    }
    try {
      window[cb] = null;
      delete window[cb];
    } catch (e) {}

  };
 
  document.body.appendChild(script);
  
  return "Loading url into DOM...";
}

function trim(s) {
  return (s||"").replace(/^\s+|\s+$/g,"");
}

var ccCache = {};
var ccPosition = false;

window._console = {
  log: function () {
    var l = arguments.length, i = 0;
    for (; i < l; i++) {
      log(stringify(arguments[i], true));
    }
  },
  dir: function () {
    var l = arguments.length, i = 0;
    for (; i < l; i++) {
      log(stringify(arguments[i]));
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
    log(err.message, 'error');
  }
};

function about() {
  return 'Built by <a target="_new" href="http://twitter.com/rem">@rem</a>';
}

var output = null,
    sandboxframe = null,
    sandbox = null,
    fakeConsole = 'window.top._console',
    libraries = {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
        prototype: 'http://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
        dojo: 'http://ajax.googleapis.com/ajax/libs/dojo/1/dojo/dojo.xd.js',
        mootools: 'http://ajax.googleapis.com/ajax/libs/mootools/1/mootools-yui-compressed.js',
        underscore: 'http://documentcloud.github.com/underscore/underscore-min.js',
        rightjs: 'http://rightjs.org/hotlink/right.js',
        coffeescript: 'http://jashkenas.github.com/coffee-script/extras/coffee-script.js',
        yui: 'http://yui.yahooapis.com/3.2.0/build/yui/yui-min.js'
    },
    body = document.getElementsByTagName('body')[0],
    logAfter = null,
    lastCmd = null,
    wait = false,
    commandPresent = /:((?:help|about|load|clear|reset|wait)(?:.*))\n/gi,
    commands = { 
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
    };


var jsconsole = {
  run: post,
  clear: commands.clear,
  reset: function () {
    this.run(':reset');
  },
  echo: echo,
  setSandbox: function (newSandbox) {
    // sandboxframe.parentNode.removeChild(sandboxframe);
    sandboxframe = newSandbox;

    sandbox = sandboxframe.contentDocument || sandboxframe.contentWindow.document;
    // sandbox.open();
    // stupid jumping through hoops if Firebug is open, since overwriting console throws error
    // sandbox.write('<script>(function () { var fakeConsole = ' + fakeConsole + '; if (window.console != undefined) { for (var k in fakeConsole) { console[k] = fakeConsole[k]; } } else { console = fakeConsole; } })();</script>');
    // sandbox.write('<script>window.print=function(){};window.alert=function(){};window.prompt=function(){};window.confirm=function(){};</script>');

    sandboxframe.contentWindow.eval('(function () { var fakeConsole = ' + fakeConsole + '; if (window.console != undefined) { for (var k in fakeConsole) { console[k] = fakeConsole[k]; } } else { console = fakeConsole; } })();');

    sandbox.close();

  },
  init: function (outputElement, nohelp) {
    output = outputElement;

    // closure scope
    sandboxframe = $live.find('iframe')[0]; //document.createElement('iframe');

    // var oldsandbox = document.getElementById('jsconsole-sandbox');
    // if (oldsandbox) {
    //   body.removeChild(oldsandbox);
    // }

    // body.appendChild(sandboxframe);
    // sandboxframe.setAttribute('id', 'jsconsole-sandbox');
    if (sandboxframe) this.setSandbox(sandboxframe);

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
  },
  stringify: stringify
};

return jsconsole;

})(this);

var msgType = '';

jsconsole.init(document.getElementById('output'));
jsconsole.queue = [];
jsconsole.remote = {
  log: function () {
    // window.console.log('remote call');
    var cmd = 'console.log';
    try {
      throw new Error();
    } catch (e) {
      // var trace = printStackTrace({ error: e }),
      //     code = jsbin.panels.panels.javascript.getCode().split('\n'),
      //     allcode = getPreparedCode().split('\n'),
      //     parts = [],
      //     line,
      //     n;

      // for (var i = 0; i < trace.length; i++) {
      //   if (trace[i].indexOf(window.location.toString()) !== -1) {
      //     parts = trace[i].split(':');
      //     n = parts.pop();
      //     if (isNaN(parseInt(n, 10))) {
      //       n = parts.pop();
      //     }
      //     line = n - 2;
      //     if (code[line] && code[line].indexOf('console.') !== -1) {
      //       cmd = $.trim(code[line]);
      //       console.log(cmd);
      //       break;
      //     }
      //   }
      // }
    }

    var argsObj = jsconsole.stringify(arguments.length == 1 ? arguments[0] : [].slice.call(arguments, 0));
    var response = [];
    [].forEach.call(arguments, function (args) {
      response.push(jsconsole.stringify(args, true));
    });

    var msg = { response: response, cmd: cmd, type: msgType };

    if (jsconsole.ready) {
      jsconsole.rawMessage(msg);
    } else {
      jsconsole.queue.push(msg);
    }

    msgType = '';
  },
  info: function () {
    msgType = 'info';
    remote.log.apply(this, arguments);
  },
  echo: function () {
    var args = [].slice.call(arguments, 0),
        plain = args.pop(),
        cmd = args.pop(),
        response = args;

    var argsObj = jsconsole.stringify(response, plain),
        msg = { response: argsObj, cmd: cmd };
    if (jsconsole.ready) {
      jsconsole.rawMessage(msg);
    } else {
      jsconsole.queue.push(msg);
    }
  },
  error: function (error, cmd) {
    var msg = { response: error.message, cmd: cmd, type: 'error' };
    if (jsconsole.ready) {
      jsconsole.rawMessage(msg);
    } else {
      jsconsole.queue.push(msg);
    }
  },
  flush: function () {
    for (var i = 0; i < jsconsole.queue.length; i++) {
      jsconsole.rawMessage(jsconsole.queue[i]);
    }
  }
};

// just for extra support
jsconsole.remote.debug = jsconsole.remote.dir = jsconsole.remote.log;
jsconsole.remote.warn = jsconsole.remote.info;

// window.top._console = jsconsole.remote;

function upgradeConsolePanel(console) {
  return;

  
  console.init = function () {
    editors.console.settings.render = function () {
      // TODO decide whether we should also grab all the JS in the HTML panel
      // jsconsole.reset();
      var code = editors.javascript.render();
      setTimeout(function () {
        jsconsole.setSandbox($live.find('iframe')[0]);
        // if ($.trim(code)) jsconsole.echo(code);
        // window.console.log('rendering console');
      }, 0);
    };
    editors.console.settings.show = function () {
      renderLivePreview(true);
      // setTimeout because the renderLivePreview creates the iframe after a timeout
      setTimeout(function () {
        jsconsole.setSandbox($live.find('iframe')[0]);
      }, 0);
    };
    editors.console.settings.hide = function () {
      if (!editors.live.visible) {
        // renderLivePreview();
        $live.find('iframe').remove();
      }
    };
    jsconsole.ready = true;
    jsconsole.remote.flush();
    // editors.console.fakeConsole = window._console
  };

  console.init();
}
