/*globals jsbin, _, $, RSVP*/
var processors = jsbin.processors = (function () {
  'use strict';
  /*
   * Debugging note: to emulate a slow connection, or a processor taking too
   * long to load, find the processor in question, and change the `init` method
   * to setTimeout(getScript, n seconds) - this will give you an idea of how
   * jsbin behaves when the processor isn't ready and the user makes calls to it
   */


  /**
   * Add properties to a function using underscore
   */
  var extendFn = function (fn, obj) {
    return _.extend(fn, obj);
  };

  var passthrough = function (ready) { return ready(); };
  var defaultProcessor = function (source, resolve) {
    resolve(source);
  };

  /**
   * Cache extension ids by their file extensions
   */
  var processorBy = {
    extension: {}
  };

  /**
   * Create a processor – accepts an object containing:
   *
   *    id          Processor name. Required.
   *    target      The target panel. Optional - defaults to the id.
   *    extensions  Possible file extensions for this processor (for gist i/o).
   *                Optional. Defaults to the id.
   *    url         URL of the loader script file. Optional.
   *    init        Setup the processor here. Optional – defaults to the
   *                passthrough (above).
   *    handler     Where the magic happens. Do all processing in here.
   *                Optional - defaults to the defaultProcessor (above).
   */
  var createProcessor = function (opts) {
    var url = opts.url,
        init = opts.init || passthrough,
        handler = opts.handler || defaultProcessor,
        processorData = _.pick(opts, 'id', 'target', 'extensions');

    opts.extensions = opts.extensions || [];
    if (!opts.extensions.length) opts.extensions = [opts.id];

    opts.extensions.forEach(function (ext) {
      processorBy.extension[ext] = opts.id;
    });

    // This actually loads in the processor – script files & init code
    var loadProcessor = function (ready) {

      var failed = false;

      // Overwritten when the script loads
      var callback = function () {
        window.console && window.console.warn('Processor is not ready yet - trying again');
        failed = true;
        return '';
      };

      // Script has loaded.
      // Run any init code, and swap the callback. If we failed, try again.
      var scriptCB = function () {
        init(function () {
          callback = handler;
          if (failed) {
            renderLivePreview();
          }
          ready();
        });
      };

      if (url) {
        // Load the processor's script
        $.getScript(url, scriptCB);
      } else {
        // No url, go straight on
        init(function () {
          callback = handler;
          ready();
        });
      }

      // Create a proxy function that holds the handler in scope so that, when
      // the callbacks are swapped, rendering still works.
      var cache = {
        source: '',
        result: ''
      };
      var proxyCallback = function (source) {
        return new RSVP.Promise(function (resolve, reject) {
          source = source.trim();
          if (source === cache.source) {
            console.log('return cache for ' + opts.id);
            resolve(cache.result);
          } else {
            callback(source, function (result) {
              console.log('compiled ' + opts.id);
              cache.source = source;
              cache.result = result;
              resolve(result);
            }, reject);
          }
        });
      };

      // Return the method that will be used to render
      return extendFn(proxyCallback, processorData);
    };

    // Processor fucntion also has the important data on it
    return extendFn(loadProcessor, processorData);
  };

  /**
   * JS Bin's processors
   */
  var processors = {

    html: createProcessor({
      id: 'html'
    }),

    css: createProcessor({
      id: 'css'
    }),

    javascript: createProcessor({
      id: 'javascript',
      extensions: ['js']
    }),

    coffeescript: createProcessor({
      id: 'coffeescript',
      target: 'javascript',
      extensions: ['coffee'],
      url: jsbin.static + '/js/vendor/coffee-script.js',
      init: function (ready) {
        $.getScript(jsbin.static + '/js/vendor/codemirror4/mode/coffeescript/coffeescript.js', ready);
      },
      handler: function (source, resolve, reject) {
        var renderedCode = '';
        try {
          renderedCode = CoffeeScript.compile(source, {
            bare: true
          });
          resolve(renderedCode);
        } catch (e) {
          reject(e);
        }
      }
    }),

    jsx: createProcessor({
      id: 'jsx',
      target: 'javascript',
      extensions: ['jsx'],
      url: jsbin.static + '/js/vendor/JSXTransformer.js',
      init: function (ready) {
        // Don't add React if the code already contains a script whose name
        // starts with 'react', to avoid duplicate copies.
        var code = editors.html.getCode();
        if (!(/<script[^>]*src=\S*\breact\b/i).test(code)) {
          $('#library').val( $('#library').find(':contains("React with Add-Ons")').val() ).trigger('change');
        }
        ready();
      },
      handler: function (source, resolve, reject) {
        var renderedCode = '';
        try {
          renderedCode = JSXTransformer.transform(source).code;
          resolve(renderedCode);
        } catch (e) {
          reject(e);
        }
      }
    }),

    typescript: createProcessor({
      id: 'typescript',
      target: 'javascript',
      extensions: ['ts'],
      url: jsbin.static + '/js/vendor/typescript.min.js',
      init: passthrough,
      handler: function (source, resolve, reject) {
        var noop = function () {};
        var outfile = {
          source: '',
          Write: function (s) {
            this.source += s;
          },
          WriteLine: function (s) {
            this.source += s + '\n';
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

        if (parseErrors.length) {
          reject();
        } else {
          resolve(outfile.source);
        }
      }
    }),

    markdown: createProcessor({
      id: 'markdown',
      target: 'html',
      extensions: ['md', 'markdown', 'mdown'],
      url: jsbin.static + '/js/vendor/markdown.js',
      init: function (ready) {
        $.getScript(jsbin.static + '/js/vendor/codemirror4/mode/markdown/markdown.js', ready);
      },
      handler: function (source, resolve, reject) {
        try {
          resolve(markdown.toHTML(source));
        } catch (e) {
          reject(e);
        }
      }
    }),

    processing: createProcessor({
      id: 'processing',
      target: 'javascript',
      extensions: ['pde'],
      url: jsbin.static + '/js/vendor/processing.min.js',
      init: function (ready) {
        $('#library').val( $('#library').find(':contains("Processing")').val() ).trigger('change');
        // init and expose jade
        $.getScript(jsbin.static + '/js/vendor/codemirror4/mode/clike/clike.js', ready);
      },
      handler: function (source, resolve, reject) {
        try {
          var sketch = Processing.compile(source).sourceCode;
          resolve([
            '(function(){',
            '  var canvas = document.querySelector("canvas");',
            '  if (!canvas) {',
            '    canvas = document.createElement("canvas");',
            '    (document.body || document.documentElement).appendChild(canvas);',
            '  }',
            '  canvas.width = window.innerWidth;',
            '  canvas.height = window.innerHeight;',
            '  var sketchProc = ' + sketch + ';',
            '  var p = new Processing(canvas, sketchProc);',
            '})();'
          ].join('\n'));
        } catch (e) {
          reject(e);
        }
      }
    }),

    jade: createProcessor({
      id: 'jade',
      target: 'html',
      extensions: ['jade'],
      url: jsbin.static + '/js/vendor/jade.js',
      init: function (ready) {
        // init and expose jade
        window.jade = require('jade');
        ready();
      },
      handler: function (source, resolve, reject) {
        try {
          resolve(jade.compile(source, { pretty: true })());
        } catch (e) {
          reject(e);
        }
      }
    }),

    less: createProcessor({
      id: 'less',
      target: 'css',
      extensions: ['less'],
      url: jsbin.static + '/js/vendor/less-1.4.2.min.js',
      init: function (ready) {
        // In CodeMirror 4, less is now included in the css mode, so no files to load
        ready();
      },
      handler: function (source, resolve, reject) {
        less.Parser().parse(source, function (err, result) {
          if (err) {
            return reject(err);
          }
          resolve(result.toCSS().trim());
        });
      }
    }),

    scss: createProcessor({
      id: 'scss',
      target: 'scss',
      extensions: ['scss'],
      url: jsbin.static + '/js/vendor/sass/dist/sass.worker.js',
      init: function (ready) {
        $.getScript(jsbin.static + '/js/vendor/codemirror3/mode/sass/sass.js', function () {
          Sass.initialize(jsbin.static + '/js/vendor/sass/dist/worker.min.js');
          ready();
        });
      },
      handler: function (source, resolve, reject) {
        Sass.compile(source, function (result) {
          if (typeof result !== 'string') {
            reject(new Error('Error on line ' + result.line + ':\n' + result.message));
          } else {
            resolve(result.trim());
          }
        });
      }
    }),

    stylus: createProcessor({
      id: 'stylus',
      target: 'css',
      extensions: ['styl'],
      url: jsbin.static + '/js/vendor/stylus.js',
      init: passthrough,
      handler: function (source, resolve, reject) {
        stylus(source).render(function (err, result) {
          if (err) {
            return reject(err);
          }

          resolve(result.trim());
        });
      }
    }),

    traceur: (function () {
      var SourceMapConsumer,
          SourceMapGenerator,
          ProjectWriter,
          ErrorReporter,
          hasError;
      return createProcessor({
        id: 'traceur',
        target: 'javascript',
        extensions: ['traceur'],
        url: jsbin.static + '/js/vendor/traceur.js',
        init: function (ready) {
          // Only create these once, when the processor is loaded
          $('#library').val( $('#library').find(':contains("Traceur")').val() ).trigger('change');
          SourceMapConsumer = traceur.outputgeneration.SourceMapConsumer;
          SourceMapGenerator = traceur.outputgeneration.SourceMapGenerator;
          ProjectWriter = traceur.outputgeneration.ProjectWriter;
          ErrorReporter = traceur.util.ErrorReporter;
          ready();
        },
        handler: function (source, resolve, reject) {
          hasError = false;

          var reporter = new ErrorReporter();
          reporter.reportMessageInternal = function(location, kind, format, args) {
            reject(new Error(ErrorReporter.format(location, format, args)));
          };

          var url = location.href;
          var project = new traceur.semantics.symbols.Project(url);
          var name = 'jsbin';

          var sourceFile = new traceur.syntax.SourceFile(name, source);
          project.addFile(sourceFile);
          var res = traceur.codegeneration.Compiler.compile(reporter, project, false);

          var msg = '/*\nIf you\'ve just translated to JS, make sure traceur is in the HTML panel.\nThis is terrible, sorry, but the only way we could get around race conditions.\n\nHugs & kisses,\nDave xox\n*/\ntry{window.traceur = top.traceur;}catch(e){}\n';
          resolve(msg + ProjectWriter.write(res));
        }
      });
    }())

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
        panel.render().then(function (source) {
          jsbin.processors.reset(panelId);
          panel.setCode(source);
        });
      }
    }).bind('select', function (event, value) {
      if (value === this.hash.substring(1)) {
        $label.text($(this).text());
      }
    });
  });

  processors.set = function (panelId, processorName, callback) {
    var panel;

    // panelId can be id or instance of a panel.
    // this is kinda nasty, but it allows me to set panel processors during boot
    if (panelId instanceof Panel) {
      panel = panelId;
      panelId = panel.id;
    } else {
      panel = jsbin.panels.panels[panelId];
    }

    if (!jsbin.state.processors) {
      jsbin.state.processors = {};
    }

    var cmMode = processorName ? editorModes[processorName] || editorModes[panelId] : editorModes[panelId];

    // For JSX, use the plain JavaScript mode but disable smart indentation
    // because it doesn't work properly
    var smartIndent = cmMode !== 'jsx';
    cmMode = cmMode === 'jsx' ? 'javascript' : cmMode;

    // For less, the mode definition is changed in CodeMirror 4
    if (cmMode === 'less') {
      cmMode = 'text/x-less';
    }

    if (!panel) { return; }

    panel.trigger('processor', processorName || 'none');
    if (processorName && processors[processorName]) {
      jsbin.state.processors[panelId] = processorName;
      panel.processor = processors[processorName](function () {
        // processor is ready
        panel.editor.setOption('mode', cmMode);
        panel.editor.setOption('smartIndent', smartIndent);
        $processorSelectors.find('a').trigger('select', [processorName]);
        if (callback) { callback(); }
      });
    } else {
      // remove the preprocessor
      panel.editor.setOption('mode', cmMode);
      panel.editor.setOption('smartIndent', smartIndent);

      panel.processor = defaultProcessor;
      delete jsbin.state.processors[panelId];
      delete panel.type;
    }
  };

  processors.reset = function (panelId) {
    processors.set(panelId);
  };

  /**
   * Find the processor that uses the given file extension
   */
  processors.findByExtension = function (ext) {
    var id = processorBy.extension[ext];
    if (!id) return defaultProcessor;
    return jsbin.processors[id];
  };

  processors.by = processorBy;

  return processors;

}());
