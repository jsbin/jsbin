var Processor = function (url, init, handler) {
  var failed = false;

  // Overwritten when the script loads
  var callback = function () {
    window.console && window.console.warn('Processor is not ready yet - trying again');
    failed = true;
    return '';
  };

  if (typeof handler === 'undefined') {
    handler = init;
    init = null;
  }

  var script = document.createElement('script');
  script.src = url;

  // Script has loaded.
  // Run any init code, and swap the callback. If we failed, try again.
  var scriptCB = function () {
    if (init) init();
    callback = handler;
    if (failed) {
      editors.console.render();
    }
  };

  script.onreadystatechange = script.onload = function() {
    var state = script.readyState;
    if (!scriptCB.done && (!state || /loaded|complete/.test(state))) {
      scriptCB.done = true;
      scriptCB();
      script.parentNode.removeChild(script);
    }
  };

  document.body.appendChild(script);

  return function () {
    return callback.apply(this, arguments);
  };
};

var processors = jsbin.processors = {
  coffeescript: function (ready) {
    return new Processor(jsbin.static + '/js/vendor/coffee-script.js', function () {
      $.getScript(jsbin.static + '/js/vendor/codemirror2/coffeescript.js', ready);
    }, function (source) { 
      var renderedCode = '';
      try {
        renderedCode = CoffeeScript.compile(source, {
          bare: true
        });
      } catch (e) {
        console && console.error(e.message);
      }
      return renderedCode;
    });
  },
  typescript: function (ready) {
    return new Processor(jsbin.static + '/js/vendor/typescript.min.js', ready, function (source) {
      var noop = function () {};
      var outfile = { 
        source: "", 
        Write: function (s) { 
          this.source += s; 
        }, 
        WriteLine: function (s) { 
          this.source += s + "\n"; 
        }, 
        Close: noop 
      };

      var outerr = { 
        Write: noop,
        WriteLine: noop,
        Close: noop
      };

      var parseErrors = [];

      var compiler = new TypeScript.TypeScriptCompiler(outfile, outerr);

      compiler.setErrorCallback(function (start, len, message) { 
        parseErrors.push({ start: start, len: len, message: message }); 
      });
      compiler.parser.errorRecovery = true;

      compiler.addUnit(source, 'jsbin.ts');
      compiler.typeCheck();
      compiler.reTypeCheck();
      compiler.emit();

      for (var i = 0, len = parseErrors.length; i < len; i++) {
        console.log('Error Message: ' + parseErrors[i].message);
        console.log('Error Start: ' + parseErrors[i].start);
        console.log('Error Length: ' + parseErrors[i].len);
      }

      return outfile.source;
    });
  },
  markdown: function (ready) {
    return new Processor(jsbin.static + '/js/vendor/markdown.js', function () {
      $.getScript(jsbin.static + '/js/vendor/codemirror2/markdown.js', ready);
    }, function (source) {
      return markdown.toHTML(source);
    });
  },
  processing: function (ready) {
    return new Processor(jsbin.static + '/js/vendor/processing.min.js', function () {
      $('#library').val( $('#library').find(':contains("Processing")').val() ).trigger('change');
      // init and expose jade
      $.getScript(jsbin.static + '/js/vendor/codemirror2/clike.js', ready);
    }, function (source) {
      source = [
        '(function(){',
        '  var canvas = document.querySelector("canvas");',
        '  if (!canvas) {',
        '    canvas = document.createElement("canvas");',
        '    (document.body || document.documentElement).appendChild(canvas);',
        '  }',
        '  canvas.width = window.innerWidth;',
        '  canvas.height = window.innerHeight;',
        '  var sketchProc = ' + Processing.compile(source).sourceCode + ';',
        '  var p = new Processing(canvas, sketchProc);',
        '})();'
      ].join('\n');

      return source;
    });
  },
  jade: function (ready) {
    return new Processor(jsbin.static + '/js/vendor/jade.js', function () {
      // init and expose jade
      window.jade = require('jade');
      ready();
    }, function (source) {
      return jade.compile(source, { pretty: true })();
    });
  },
  less: function (ready) {
    return new Processor(jsbin.static + '/js/vendor/less-1.3.0.min.js', function () {
      $.getScript(jsbin.static + '/js/vendor/codemirror2/less.js', ready);
    }, function (source) {
      var css = '';

      less.Parser().parse(source, function (err, result) {
        if (err) {
          console && console.error(err);
          return source;
        }
        css = $.trim(result.toCSS());
      });
      return css;
    });
  },
  stylus: function (ready) {
    return new Processor(jsbin.static + '/js/vendor/stylus.js', ready, function (source) {
      var css = '';

      stylus(source).render(function (err, result) {
        if (err) {
          console && console.error(err);
          return;
        }
        css = $.trim(result);
      });
      return css;
    });
  },
  traceur: function (ready) {
    var SourceMapConsumer,
        SourceMapGenerator,
        ProjectWriter,
        ErrorReporter,
        hasError;
    return new Processor(jsbin.static + '/js/vendor/traceur.js', function () {
      // Only create these once, when the processor is loaded
      $('#library').val( $('#library').find(':contains("Traceur")').val() ).trigger('change');
      SourceMapConsumer = traceur.outputgeneration.SourceMapConsumer;
      SourceMapGenerator = traceur.outputgeneration.SourceMapGenerator;
      ProjectWriter = traceur.outputgeneration.ProjectWriter;
      ErrorReporter = traceur.util.ErrorReporter;
      ready();
    }, function (source) {
      hasError = false;

      var reporter = new ErrorReporter();
      reporter.reportMessageInternal = function(location, kind, format, args) {
        window.console.error(ErrorReporter.format(location, format, args));
      };

      var url = location.href;
      var project = new traceur.semantics.symbols.Project(url);
      var name = 'jsbin';

      var sourceFile = new traceur.syntax.SourceFile(name, source);
      project.addFile(sourceFile);
      var res = traceur.codegeneration.Compiler.compile(reporter, project, false);

      var msg = '/*\nIf you\'ve just translated to JS, make sure traceur is in the HTML panel.\nThis is terrible, sorry, but the only way we could get around race conditions. Eat me.\nHugs & kisses,\nDave xox\n*/\ntry{window.traceur = top.traceur;}catch(e){}\n';
      return msg + ProjectWriter.write(res);
    });
  }
};


var render = function() {
  if (jsbin.panels.ready) {
    editors.console.render();
  }
};

var $processorSelectors = $('div.processorSelector').each(function () {
  var panelId = this.getAttribute('data-type'),
      $el = $(this),
      $label = $el.closest('.label').find('strong a'),
      originalLabel = $label.text();

  $el.find('a').click(function (e) {
    var panel = jsbin.panels.panels[panelId];

    e.preventDefault();
    var target = this.hash.substring(1),
        label = $(this).text(),
        code;
    if (target !== 'convert') {
      $label.text(label);
      if (target === panelId) {
        jsbin.processors.reset(panelId);
        render();
      } else {
        jsbin.processors.set(panelId, target, render);
      }
    } else {
      $label.text(originalLabel);
      panel.setCode(panel.render());
      jsbin.processors.reset(panelId);
    }
  }).bind('select', function (event, value) {
    if (value === this.hash.substring(1)) {
      $label.text($(this).text());
    }
  });
});



processors.set = function (panelId, preprocessor, callback) {
  var panel = jsbin.panels.panels[panelId];

  // this is kinda nasty, but it allows me to set panel processors during boot up
  if (panelId instanceof Panel) {
    panel = panelId;
    panelId = panel.id;
  }

  if (!jsbin.state.processors) {
    jsbin.state.processors = {};
  }

  var cmMode = preprocessor ? editorModes[preprocessor] || editorModes[panelId] : editorModes[panelId];

  if (panel) {
    panel.trigger('processor', preprocessor || 'none');
    if (preprocessor && processors[preprocessor]) {
      jsbin.state.processors[panelId] = preprocessor;
      panel.processor = processors[preprocessor](function () {
        // processor is ready
        panel.editor.setOption('mode', cmMode);
        $processorSelectors.find('a').trigger('select', [preprocessor]);
        if (callback) callback();
      });
    } else {
      // remove the preprocessor
      panel.editor.setOption('mode', cmMode);

      panel.processor = function (source) {
        return source;
      };
      delete jsbin.state.processors[panelId];
      delete panel.type;
    }
  }
};

processors.reset = function (panelId) {
  processors.set(panelId);
};