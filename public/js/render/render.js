var consoleTest = /(^.|\b)console\./;

var iframedelay = (function () {
  var iframedelay = { active : false },
      iframe = document.createElement('iframe'),
      doc,
      callbackName = '__callback' + (+new Date);

  iframe.style.height = iframe.style.width = '1px';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);
  doc = iframe.contentDocument || iframe.contentWindow.document;

  window[callbackName] = function (width) {
    iframedelay.active = width === 0;
    try {
      iframe.parentNode.removeChild(iframe);
      delete window[callbackName];
    } catch (e){};
  };

  try {
    doc.open();
    doc.write('<script>window.parent.' + callbackName + '(window.innerWidth)</script>');
    doc.close();
  } catch (e) {
    iframedelay.active = true;
  }
  
  return iframedelay;
}());



var useCustomConsole = !(function () {
  var ok = typeof window.console !== 'undefined';
  try {
    window.console.log('jsbin init test');
  } catch (e) {
    ok = false;
  }
  return ok;
})();

var re = null;

function getPreparedCode() {
  // init the regular expression cache because this function 
  // is called much earlier than the above code is actually encountered
  // yay for massive .js app!
  if (!re) {
    re = {
      docReady: /\$\(document\)\.ready/,
      shortDocReady: /\$\(function/,
      console: /(^.|\b)console\./g,
      script: /<\/script/ig,
      code: /%code%/,
      title: /<title>(.*)<\/title>/i,
      winLoad: /window\.onload\s*=/
    };
  }

  var parts = [],
      source = '',
      js = '',
      css = '',
      close = '';

  try {
    source = editors.html.render();
  } catch (e) {
    console.error(e.message);
  }

  try {
    js = editors.javascript.render();
  } catch (e) {
    console.error(e.message);
  }

  try {
    css = editors.css.render();
  } catch (e) {
    console.error(e.message);
  }

  // escape any script tags in the JS code, because that'll break the mushing together
  js = js.replace(re.script, '<\\/script');

  // note that I'm using split and reconcat instead of replace, because if the js var
  // contains '$$' it's replaced to '$' - thus breaking Prototype code. This method
  // gets around the problem.
  if (!$.trim(source) && $.trim(js)) {
    source = "<pre>\n" + js + "</pre>";
  } else if (re.code.test(source)) {
    parts = source.split('%code%');
    source = parts[0] + js + parts[1];
  } else if (js) {
    close = '';
    if (source.indexOf('</body>') !== -1) {
      parts.push(source.substring(0, source.lastIndexOf('</body>')))
      parts.push(source.substring(source.lastIndexOf('</body>')));

      source = parts[0];
      close = parts.length == 2 && parts[1] ? parts[1] : '';
    }
    if (useCustomConsole) {
      source += "<script src=\"http://jsbin.com/js/render/console.js\"></script>\n<script>\n";
    }
    // source += "<script>\ntry {\n" + js + "\n} catch (e) {" + (window.console === undefined ? '_' : 'window.top.') + "console.error(e)}\n</script>\n" + close;
    // RS: not sure why I ran this in closure, but it means the expected globals are no longer so
    // source += "<script>\n(function(){" + js + "\n}())\n</script>\n" + close;
    var type = jsbin.settings && jsbin.settings.processors && jsbin.settings.processors.javascript ? ' type="text/' + jsbin.settings.processors.javascript + '"' : '';
    source += "<script" + type + ">\n" + js + "\n</script>\n" + close;
  }

  // redirect console logged to our custom log while debugging
  if (re.console.test(source)) {
    if (jsbin.panels.panels.console.visible) {
      source = source.replace(re.console, 'window.top._console.');
    } else {
      source = source.replace(re.console, 'window.top.console.');
    }
  }

  if (!$.trim(source) && !$.trim(js) && css) {
    source = "<pre>\n" + css + "</pre>";
  } else if (css) {
    parts = [];
    close = '';
    if (source.indexOf('</head>') !== -1) {
      parts.push(source.substring(0, source.lastIndexOf('</head>')))
      parts.push(source.substring(source.lastIndexOf('</head>')));

      source = parts[0];
      close = parts.length == 2 && parts[1] ? parts[1] : '';
    }
    source += '<style>\n' + css + '\n</style>\n' + close;
  }

  // specific change for rendering $(document).ready() because iframes doesn't trigger ready (TODO - really test in IE, may have been fixed...)
  if (re.docReady.test(source)) {
    source = source.replace(re.docReady, 'window.onload = ');
  } 

  if (re.shortDocReady.test(source)) {
    source = source.replace(re.shortDocReady, 'window.onload = (function');
  }

  // read the element out of the source code and plug it in to our document.title
  var newDocTitle = source.match(re.title);
  if (newDocTitle !== null && newDocTitle[1] !== documentTitle) {
    documentTitle = newDocTitle[1];
    updateTitle(!/ \[unsaved\]/.test(document.title));
  }

  return source;
}

function renderPreview() {
  var doc = $('#preview iframe')[0], 
      win = doc.contentDocument || doc.contentWindow.document,
      source = getPreparedCode();

  var run = function () {
    win.open();
    if (debug) {
      win.write('<pre>' + source.replace(/[<>&]/g, function (m) {
        if (m == '<') return '&lt;';
        if (m == '>') return '&gt;';
        if (m == '"') return '&quot;';
      }) + '</pre>');
    } else {
      win.write(source);
    }
    win.close();
  };

  // WebKit requires a wait time before actually writing to the iframe
  // annoyingly it's not consistent (I suspect WebKit is the buggy one)
  if (iframedelay.active) {
    // this setTimeout allows the iframe to be rendered before our code
    // runs - thus allowing us access to the innerWidth, et al
    setTimeout(run, 10);
  } else {
    run();
  }
}
