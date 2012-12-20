//= require "../vendor/prettyprint"
//= require "../vendor/stacktrace"

var jsconsole = (function (window) {

function sortci(a, b) {
  return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
    json = '[circular ' + type.slice(1);
    if (o.outerHTML) {
      json += ":\n" + htmlEntities(o.outerHTML);
    }
  } else if (type == '[object String]') {
    json = '"' + htmlEntities(o.replace(/"/g, '\\"')) + '"';
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
    visited.push(o);
    try {
      json = stringify(o, true, visited)+''; // should look like an object
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

  if (blind === undefined) {
    history.push(cmd);
    setHistory(history);
  } 

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

  if (!internalCommand(cmd)) {

    // Fix console not having iframe
    if (!(sandboxframe && sandboxframe.contentWindow)) {
      // Boo. There must be a nice way to do this.
      sandboxframe = $live.find('iframe')[0];
      // Only force it to render if there's no live iframe
      if (!(sandboxframe && sandboxframe.contentWindow)) {
        renderLivePreview(false);
        sandboxframe = $live.find('iframe')[0];
      }
      jsconsole.setSandbox(sandboxframe);
    }
  }

  // In a setTimeout so that renderLivePreview has time for the iframe to load
  setTimeout(function () {
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

      exec.value = '';
      if (enableCC) {
        try {
          // document.getElementsByTagName('a')[0].focus();
          if (jsbin.panels.focused.id === 'console') {
            cursor.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);          
          }
        } catch (e) {}
      }
    }
    pos = history.length;
  }, 0);

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
    window.console.log.apply(window.console, arguments);
  },
  dir: function () {
    var l = arguments.length, i = 0;
    for (; i < l; i++) {
      log(stringify(arguments[i]));
    }
    window.console.dir.apply(window.console, arguments);
  },
  props: function (obj) {
    var props = [], realObj;
    try {
      for (var p in obj) props.push(p);
    } catch (e) {}
    window.console.props.apply(window.console, arguments);
    return props;
  },
  error: function (err) {
    log(err.message, 'error');
    window.console.error.apply(window.console, arguments);
  }
};

function about() {
  return 'Ported to JS Bin from <a target="_new" href="http://jsconsole.com">jsconsole.com</a>';
}

function setHistory(history) {
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
    sandboxframe = null,
    sandbox = null,
    history = getHistory(),
    codeCompleteTimer = null,
    fakeConsole = 'window.top._console',
    libraries = {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
        prototype: 'http://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
        dojo: 'http://ajax.googleapis.com/ajax/libs/dojo/1/dojo/dojo.xd.js',
        mootools: 'http://ajax.googleapis.com/ajax/libs/mootools/1/mootools-yui-compressed.js',
        underscore: 'http://documentcloud.github.com/underscore/underscore-min.js',
        rightjs: 'http://rightjs.org/hotlink/right.js',
        coffeescript: 'http://jashkenas.github.com/coffee-script/extras/coffee-script.js',
        yui: 'http://yui.yahooapis.com/3.8.0/build/yui/yui-min.js'
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
    // I hate that I'm browser sniffing, but there's issues with Firefox and execCommand so code completion won't work
    iOSMobile = navigator.userAgent.indexOf('AppleWebKit') !== -1 && navigator.userAgent.indexOf('Mobile') !== -1,
    // FIXME Remy, seriously, don't sniff the agent like this, it'll bite you in the arse.
    enableCC = navigator.userAgent.indexOf('AppleWebKit') !== -1 && navigator.userAgent.indexOf('Mobile') === -1 || navigator.userAgent.indexOf('OS 5_') !== -1;

if (enableCC) {
  exec.parentNode.innerHTML = '<div autofocus id="exec" autocapitalize="off" spellcheck="false"><span id="cursor" spellcheck="false" autocapitalize="off" autocorrect="off"' + (iOSMobile ? '' : ' contenteditable') + '></span></div>';
  exec = document.getElementById('exec');
  cursor = document.getElementById('cursor');
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

// sandbox = sandboxframe.contentDocument || sandboxframe.contentWindow.document;

// tweaks to interface to allow focus
// if (!('autofocus' in document.createElement('input'))) exec.focus();

function whichKey(event) {
  var keys = {38:1, 40:1, Up:38, Down:40, Enter:10, 'U+0009':9, 'U+0008':8, 'U+0190':190, 'Right':39, 
      // these two are ignored
      'U+0028': 57, 'U+0026': 55 }; 
  return keys[event.keyIdentifier] || event.which || event.keyCode;
}

function setCursorTo(str) {
  str = enableCC ? cleanse(str) : str;
  exec.value = str;
  
  if (enableCC) {
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);
    document.execCommand('insertHTML', false, str);
  } else {
    var rows = str.match(/\n/g);
    exec.setAttribute('rows', rows !== null ? rows.length + 1 : 1);
  }
  cursor.focus();
  // window.scrollTo(0,0);
}

// output.ontouchstart = output.onclick = function (event) {
//   event = event || window.event;
//   if (event.target.nodeName == 'A' && event.target.className == 'permalink') {
//     var command = decodeURIComponent(event.target.search.substr(1));
//     setCursorTo(command);
    
//     if (liveHistory) {
//       window.history.pushState(command, command, event.target.href);
//     }
    
//     return false;
//   }
// };

exec.ontouchstart = function () {
  window.scrollTo(0,0);
};

exec.onkeyup = function (event) {
  var which = whichKey(event);

  if (enableCC && which != 9 && which != 16) {
    clearTimeout(codeCompleteTimer);
    codeCompleteTimer = setTimeout(function () {
      codeComplete(event);
    }, 200);
  } 
};

if (enableCC) {
  // disabled for now
  cursor.__onpaste = function (event) {
    setTimeout(function () {
      // this causes the field to lose focus - I'll leave it here for a while, see how we get on.
      // what I need to do is rip out the contenteditable and replace it with something entirely different
      cursor.innerHTML = cursor.innerText;
      // setCursorTo(cursor.innerText);
    }, 10);
  };
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

exec.onkeydown = function (event) {
  event = event || window.event;
  var keys = {38:1, 40:1}, 
      wide = body.className == 'large', 
      which = whichKey(event);

  if (typeof which == 'string') which = which.replace(/\/U\+/, '\\u');
  if (keys[which]) {
    if (event.shiftKey) {
      // changeView(event);
    } else if (!wide) { // history cycle
      if (enableCC && window.getSelection) {
        window.selObj = window.getSelection();
        var selRange = selObj.getRangeAt(0);
        
        cursorPos =  findNode(selObj.anchorNode.parentNode.childNodes, selObj.anchorNode) + selObj.anchorOffset;
        var value = exec.value,
            firstnl = value.indexOf('\n'),
            lastnl = value.lastIndexOf('\n');

        if (firstnl !== -1) {
          if (which == 38 && cursorPos > firstnl) {
            return;
          } else if (which == 40 && cursorPos < lastnl) {
            return;
          }
        }
      }
      
      if (which == 38) { // cycle up
        pos--;
        if (pos < 0) pos = 0; //history.length - 1;
      } else if (which == 40) { // down
        pos++;
        if (pos >= history.length) pos = history.length; //0;
      } 
      if (history[pos] != undefined && history[pos] !== '') {
        removeSuggestion();
        setCursorTo(history[pos])
        return false;
      } else if (pos == history.length) {
        removeSuggestion();
        setCursorTo('');
        return false;
      }
    }
  } else if ((which == 13 || which == 10) && event.shiftKey == false) { // enter (what about the other one)
    removeSuggestion();
    if (event.shiftKey == true || event.metaKey || event.ctrlKey || !wide) {
      var command = exec.textContent || exec.value;
      if (command.length) post(command);
      return false;
    }
  } else if ((which == 13 || which == 10) && !enableCC && event.shiftKey == true) {
    // manually expand the textarea when we don't have code completion turned on
    var rows = exec.value.match(/\n/g);
    rows = rows != null ? rows.length + 2 : 2;
    exec.setAttribute('rows', rows);
  } else if (which == 9 && wide) {
    checkTab(event);
  } else if (event.shiftKey && event.metaKey && which == 8) {
    output.innerHTML = '';
  } else if ((which == 39 || which == 35) && ccPosition !== false) { // complete code
    completeCode();
  } else if (event.ctrlKey && which == 76) {
    output.innerHTML = '';
  } else if (enableCC) { // try code completion
    if (ccPosition !== false && which == 9) {
      codeComplete(event); // cycles available completions
      return false;
    } else if (ccPosition !== false && cursor.nextSibling) {
      removeSuggestion();
    }
  }
};

if (enableCC && iOSMobile) {
  fakeInput.onkeydown = function (event) {
    removeSuggestion();
    var which = whichKey(event);
    
    if (which == 13 || which == 10) {
      post(this.value);
      this.value = '';
      cursor.innerHTML = '';
      return false;
    }
  };

  fakeInput.onkeyup = function (event) {
    cursor.innerHTML = cleanse(this.value);
    var which = whichKey(event);
    if (enableCC && which != 9 && which != 16) {
      clearTimeout(codeCompleteTimer);
      codeCompleteTimer = setTimeout(function () {
        codeComplete(event);
      }, 200);
    } 
  };

  var fakeInputFocused = false;

  var dblTapTimer = null,
      taps = 0;

  form.addEventListener('touchstart', function (event) {
    // window.scrollTo(0,0);
    if (ccPosition !== false) {
      event.preventDefault();
      clearTimeout(dblTapTimer);
      taps++;

      if (taps === 2) {
        completeCode();
        fakeInput.value = cursor.textContent;
        removeSuggestion();
        fakeInput.focus();
      } else {
        dblTapTimer = setTimeout(function () {
          taps = 0;
          codeComplete({ which: 9 });
        }, 200);
      }
    }

    return false;
  });
}

function completeCode(focus) {
  var tmp = exec.textContent, l = tmp.length;
  removeSuggestion();
  
  cursor.innerHTML = tmp;
  ccPosition = false;
  
  // daft hack to move the focus elsewhere, then back on to the cursor to
  // move the cursor to the end of the text.
  document.getElementsByTagName('a')[0].focus();
  cursor.focus();
  
  var range, selection;
  if (document.createRange) {//Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(cursor);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection();//get the selection object (allows you to change selection)
    selection.removeAllRanges();//remove any selections already made
    selection.addRange(range);//make the range you have just created the visible selection
  } else if (document.selection) {//IE 8 and lower
    range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
    range.moveToElementText(cursor);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    range.select();//Select the range (make it the visible selection
  }
}

form.onsubmit = function (event) {
  event = event || window.event;
  event.preventDefault && event.preventDefault();
  removeSuggestion();
  post(exec.textContent || exec.value);
  return false;
};

document.onkeydown = function (event) {
  event = event || window.event;
  var which = event.which || event.keyCode;
  
  if (event.shiftKey && event.metaKey && which == 8) {
    output.innerHTML = '';
    cursor.focus();
  } else if (event.target == output.parentNode && which == 32) { // space
    output.parentNode.scrollTop += 5 + output.parentNode.offsetHeight * (event.shiftKey ? -1 : 1);
  }
  
  // return changeView(event);
};

exec.onclick = function () {
  cursor.focus();
}

function getProps(cmd, filter) {
  var surpress = {}, props = [];
  
  if (!ccCache[cmd]) {
    try {
      // surpress alert boxes because they'll actually do something when we're looking
      // up properties inside of the command we're running
      surpress.alert = sandboxframe.contentWindow.alert;
      sandboxframe.contentWindow.alert = function () {};
      
      // loop through all of the properties available on the command (that's evaled)
      ccCache[cmd] = sandboxframe.contentWindow.eval('console.props(' + cmd + ')').sort();
      
      // return alert back to it's former self
      delete sandboxframe.contentWindow.alert;
    } catch (e) {
      ccCache[cmd] = [];
    }
    
    // if the return value is undefined, then it means there's no props, so we'll 
    // empty the code completion
    if (ccCache[cmd][0] == 'undefined') ccOptions[cmd] = [];    
    ccPosition = 0;
    props = ccCache[cmd];
  } else if (filter) {
    // console.log('>>' + filter, cmd);
    for (var i = 0, p; i < ccCache[cmd].length, p = ccCache[cmd][i]; i++) {
      if (p.indexOf(filter) === 0) {
        if (p != filter) {
          props.push(p.substr(filter.length, p.length));
        }
      }
    }
  } else {
    props = ccCache[cmd];
  }
  
  return props; 
}

function codeComplete(event) {
  var cmd = cursor.textContent.split(/[;\s]+/g).pop(),
      parts = cmd.split('.'),
      which = whichKey(event),
      cc,
      props = [];

  if (cmd) {
    // get the command without the dot to allow us to introspect
    if (cmd.substr(-1) == '.') {
      // get the command without the '.' so we can eval it and lookup the properties
      cmd = cmd.substr(0, cmd.length - 1);
      
      // returns an array of all the properties from the command
      props = getProps(cmd);
    } else {
      props = getProps(parts.slice(0, parts.length - 1).join('.') || 'window', parts[parts.length - 1]);
    }
    if (props.length) {
      if (which == 9) { // tabbing cycles through the code completion
        // however if there's only one selection, it'll auto complete
        if (props.length === 1) {
          ccPosition = false;
        } else {
          if (event.shiftKey) {
            // backwards
            ccPosition = ccPosition == 0 ? props.length - 1 : ccPosition-1;
          } else {
            ccPosition = ccPosition == props.length - 1 ? 0 : ccPosition+1;
          }
        }      
      } else {
        ccPosition = 0;
      }
    
      if (ccPosition === false) {
        completeCode();
      } else {
        // position the code completion next to the cursor
        if (!cursor.nextSibling) {
          cc = document.createElement('span');
          cc.className = 'suggest';
          exec.appendChild(cc);
        } 

        cursor.nextSibling.innerHTML = props[ccPosition];
        exec.value = exec.textContent;
      }

      if (which == 9) return false;
    } else {
      ccPosition = false;
    }
  } else {
    ccPosition = false;
  }
  
  if (ccPosition === false && cursor.nextSibling) {
    removeSuggestion();
  }
  
  exec.value = exec.textContent;
}

function removeSuggestion() {
  if (!enableCC) exec.setAttribute('rows', 1);
  if (enableCC && cursor.nextSibling) cursor.parentNode.removeChild(cursor.nextSibling);
}

var jsconsole = {
  run: post,
  clear: commands.clear,
  reset: function () {
    this.run(':reset');
  },
  focus: function () {
    if (enableCC) {
      cursor.focus();
    } else {
      $(exec).focus();
    }
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
    // sandbox.open();
    // sandbox.write(getPreparedCode(true));
    sandboxframe.contentWindow.eval('(function () { var fakeConsole = ' + fakeConsole + '; if (window.console != undefined) { for (var k in fakeConsole) { console[k] = fakeConsole[k]; } } else { console = fakeConsole; } })();');

    // sandbox.close();

    this.sandboxframe = sandboxframe;

    if (sandbox.readyState !== 'complete') {
      this.ready = false;
    } else {
      jsconsole.onload();
    }

    sandbox.onreadystatechange = function () {
      if (sandbox.readyState === 'complete') {
        jsconsole.ready = true;
        jsconsole.onload();
      }
    };

    getProps('window'); // cache 
  },
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
  // console.init = function () {
    console.$el.click(function () {
      jsconsole.focus();
    });
    console.reset = function () {
      jsconsole.reset();
    };
    console.settings.render = function (withAlerts) {
      var html = editors.html.render().trim();
      if (html === "") {
        var code = editors.javascript.render().trim();
        jsconsole.run(code);
      } else {
        renderLivePreview(withAlerts || false);
      }
    };
    console.settings.show = function () {
      jsconsole.clear();
      // renderLivePreview(true);
      // setTimeout because the renderLivePreview creates the iframe after a timeout
      setTimeout(function () {
        // jsconsole.setSandbox($live.find('iframe')[0]);
        if (editors.console.ready) jsconsole.focus();
      }, 0);
    };
    console.settings.hide = function () {
      // Removal code is commented out so that the
      // output iframe is never removed
      if (!editors.live.visible) {
        // $live.find('iframe').remove();
      }
    };
    // jsconsole.ready = true;
    jsconsole.remote.flush();

    $document.one('jsbinReady', function () {
      var hidebutton = function () {
        $('#runconsole')[this.visible ? 'hide' : 'show']();
      };

      jsbin.panels.panels.live.on('show', hidebutton).on('hide', hidebutton);

      if (jsbin.panels.panels.live.visible) {
        $('#runconsole').hide();
      }

    });
    // editors.console.fakeConsole = window._console
  // };

  // console.init();
}
