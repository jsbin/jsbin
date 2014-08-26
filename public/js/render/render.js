/*globals $, jsbin, editors, RSVP, loopProtect, documentTitle, CodeMirror, hintingDone*/

var renderCodeWorking = false;

var getRenderedCode = function () {
  'use strict';

  var formatErrors = function(res) {
    var errors = [];
    var line = 0;
    var ch = 0;
    for (var i = 0; i < res.length; i++) {
      line = res[i].line || 0;
      ch = res[i].ch || 0;
      errors.push({
        from: CodeMirror.Pos(line, ch),
        to: CodeMirror.Pos(line, ch),
        message: res[i].msg,
        severity : 'error'
      });
    }
    return errors;
  };

  if (renderCodeWorking) {
    // cancel existing jobs, and replace with this job
  }

  renderCodeWorking = true;

  function render(language) {
    return new RSVP.Promise(function (resolve, reject) {
      editors[language].render().then(resolve, function (error) {
        console.warn(editors[language].processor.id + ' processor compilation failed');
        if (!error) {
          error = {};
        }

        if ($.isArray(error)) { // then this is for our hinter
          // console.log(data.errors);
          var cm = jsbin.panels.panels[language].editor;

          // if we have the error reporting function (called updateLinting)
          if (typeof cm.updateLinting !== 'undefined') {
            hintingDone(cm);
            var err = formatErrors(error);
            cm.updateLinting(err);
          } else {
            // otherwise dump to the console
            console.warn(error);
          }
        } else if (error.message) {
          console.warn(error.message, error.stack);
        } else {
          console.warn(error);
        }

        reject(error);
      });
    });
  }

  var promises = {
    html: render('html'),
    javascript: render('javascript'),
    css: render('css')
  };

  return RSVP.hash(promises);
};

var getPreparedCode = (function () {
  'use strict';

  var escapeMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
  }, re = {
      docReady: /\$\(document\)\.ready/,
      shortDocReady: /\$\(function/,
      console: /(^.|\b)console\.(\S+)/g,

      // https://github.com/jsbin/jsbin/issues/1833
      consoleReplace: /\b(console\.log\(('[^']*'|"[^"]*"|\([^)]*\)|[^\/\(\)'"]*|\/\/[^\n]*\n)*\))/g,
      script: /<\/script/ig,
      code: /%code%/,
      csscode: /%css%/,
      title: /<title>(.*)<\/title>/i,
      description: /<meta.*name=["']description['"].*?>/i,
      winLoad: /window\.onload\s*=/,
      scriptopen: /<script/gi
    };

  return function (nojs) {
    // reset all the regexp positions for reuse
    re.docReady.lastIndex = 0;
    re.shortDocReady.lastIndex = 0;
    re.console.lastIndex = 0;
    re.consoleReplace.lastIndex = 0;
    re.script.lastIndex = 0;
    re.code.lastIndex = 0;
    re.csscode.lastIndex = 0;
    re.title.lastIndex = 0;
    re.winLoad.lastIndex = 0;
    re.scriptopen.lastIndex = 0;

    return getRenderedCode().then(function (code) {
      var parts = [],
          html = code.html,
          js = !nojs ? code.javascript : '',
          css = code.css,
          close = '',
          hasHTML = !!html.trim().length,
          hasCSS = !!css.trim().length,
          hasJS = !!js.trim().length,
          replaceWith = 'window.runnerWindow.proxyConsole.';

      // this is used to capture errors with processors, sometimes their errors
      // aren't useful (Script error. (line 0) #1354) so we try/catch and then
      // throw the real error. This also works exactly as expected with non-
      // processed JavaScript
      js = 'try {' + js + '\n} catch (error) { throw error; }';

      // Rewrite loops to detect infiniteness.
      // This is done by rewriting the for/while/do loops to perform a check at
      // the start of each iteration.
      js = loopProtect.rewriteLoops(js);

      // escape any script tags in the JS code, because that'll break the mushing together
      js = js.replace(re.script, '<\\/script');

      // note that I'm using split and reconcat instead of replace, because if the js var
      // contains '$$' it's replaced to '$' - thus breaking Prototype code. This method
      // gets around the problem.
      if (!hasHTML && hasJS) {
        html = '<pre>\n' + js.replace(/[<>&]/g, function (m) {
          return escapeMap[m];
        }) + '</pre>';
      } else if (re.code.test(html)) {
        html = html.split('%code%').join(js);
      } else if (hasJS) {
        close = '';
        if (html.indexOf('</body>') !== -1) {
          parts.push(html.substring(0, html.lastIndexOf('</body>')));
          parts.push(html.substring(html.lastIndexOf('</body>')));

          html = parts[0];
          close = parts.length === 2 && parts[1] ? parts[1] : '';
        }

        // RS: not sure why I ran this in closure, but it means the expected globals are no longer so
        // js = "window.onload = function(){" + js + "\n}\n";
        var type = jsbin.panels.panels.javascript.type ? ' type="text/' + jsbin.panels.panels.javascript.type + '"' : '';

        js += '\n\n//# sourceURL=' + jsbin.state.code + '.js';

        html += '<script' + type + '>' + js + '\n</script>\n' + close;
      }

      // reapply the same proxyConsole - but to all the html code, since
      if (re.console.test(html)) {
        // yes, this code looks stupid, but in fact what it does is look for
        // 'console.' and then checks the position of the code. If it's inside
        // an openning script tag, it'll change it to window.top._console,
        // otherwise it'll leave it.
        var first = ' /* double call explained https://github.com/jsbin/jsbin/issues/1833 */';
        html = html.replace(re.console, function (all, str, arg, pos) {
          var open = html.lastIndexOf('<script', pos),
              close = html.lastIndexOf('</script', pos),
              info = first;

          first = null;

          if (open > close) {
            // swap console.log('foo') to console.log('foo')() to get the right
            // line number #1833.
            return all.replace(re.consoleReplace, '$1()' + (info ? info : ''));
          } else {
            return all;
          }
        });
      }

      if (!hasHTML && !hasJS && hasCSS) {
        html = '<pre>\n' + css.replace(/[<>&]/g, function (m) {
          return escapeMap[m];
        }) + '</pre>';
      } else if (re.csscode.test(html)) {
        html = html.split('%css%').join(css);
      } else if (css && hasHTML) {
        parts = [];
        close = '';
        if (html.indexOf('</head>') !== -1) {
          parts.push(html.substring(0, html.lastIndexOf('</head>')));
          parts.push(html.substring(html.lastIndexOf('</head>')));

          html = parts[0];
          close = parts.length === 2 && parts[1] ? parts[1] : '';
        }
        html += '<style>\n' + css + '\n</style>\n' + close;
      }

      // Add defer to all inline script tags in IE.
      // This is because IE runs scripts as it loads them, so variables that
      // scripts like jQuery add to the global scope are undefined.
      // See http://jsbin.com/ijapom/5
      if (jsbin.ie && re.scriptopen.test(html)) {
        html = html.replace(/<script(.*?)>/gi, function (all, match) {
          if (match.indexOf('src') !== -1) {
            return all;
          } else {
            return '<script defer' + match + '>';
          }
        });
      }

      var description = (html.match(re.description) || [''])[0];
      if (description) {
        var i = description.indexOf('content=') + 'content='.length;
        var quote = description.slice(i, i+1);
        jsbin.state.description = description.substr(i + 1).replace(new RegExp(quote + '.*$'), '');
      }


      // read the element out of the html code and plug it in to our document.title
      var newDocTitle = (html.match(re.title) || [,''])[1].trim();
      if (newDocTitle && newDocTitle !== documentTitle) {
        jsbin.state.title = documentTitle = newDocTitle;
        if (documentTitle) {
          document.title = documentTitle + ' - ' + 'JS Bin';
        } else {
          document.title = 'JS Bin';
        }
      }

      return html;
    });
  };

}());
