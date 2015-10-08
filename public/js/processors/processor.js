/*globals jsbin, _, $, RSVP, renderLivePreview, editors, throttle, debounceAsync, hintingDone, CodeMirror, Panel, editorModes */
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
  var defaultProcessor = function (source, resolve, reject) {
    return new RSVP.Promise(function (resolve) {
      resolve(source);
    }).then(resolve, reject);
  };

  /**
   * Cache extension ids by their file extensions
   */
  var processorBy = {
    extension: {}
  };

  /**
   * A version of $.getScript, but using our jsbin version
   * as the cachebuster
   */
  var getScript = function (url, callback) {
    $.ajax({
      cache: true,
      url: url + '?' + jsbin.version,
      dataType: 'script',
      success: callback
    });
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
    if (!opts.extensions.length) {
      opts.extensions = [opts.id];
    }

    opts.extensions.forEach(function (ext) {
      processorBy.extension[ext] = opts.id;
    });

    // This actually loads in the processor – script files & init code
    var loadProcessor = function (ready) {

      var failed = false;

      // Overwritten when the script loads
      var callback = function () {
        if (window.console) {
          window.console.warn('Processor is not ready yet - trying again');
        }
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
        getScript(url, scriptCB);
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

      if (processorData.target) {
        if (!jsbin.state.cache) {
          jsbin.state.cache = {};
        }
        jsbin.state.cache[processorData.target] = cache;
      }
      var proxyCallback = function (source) {
        return new RSVP.Promise(function (resolve, reject) {
          source = source.trim();
          if (source === cache.source) {
            resolve(cache.result);
          } else {
            callback(source, function (result) {
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
      id: 'html',
      extensions: ['html']
    }),

    css: createProcessor({
      id: 'css',
      extensions: ['css']
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
      init: function coffeescript(ready) {
        getScript(jsbin.static + '/js/vendor/codemirror5/mode/coffeescript/coffeescript.js', ready);
      },
      handler: function (source, resolve, reject) {
        var renderedCode = '';
        try {
          renderedCode = window.CoffeeScript.compile(source, {
            bare: true
          });
          resolve(renderedCode);
        } catch (e) {
          var errors = {
            line: parseInt(e.location.first_line, 10) || 0, // jshint ignore:line
            ch: parseInt(e.location.first_column, 10) || 0, // jshint ignore:line
            msg: e.message
          };

          reject([errors]);
        }
      }
    }),

    jsx: createProcessor({
      id: 'jsx',
      target: 'javascript',
      extensions: ['jsx'],
      url: jsbin.static + '/js/vendor/JSXTransformer.js',
      init: function jsx(ready) {
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
          renderedCode = window.JSXTransformer.transform(source).code;
          resolve(renderedCode);
        } catch (e) {
          reject(e);
        }
      }
    }),

    livescript: createProcessor({
      id: 'livescript',
      target: 'javascript',
      extensions: ['ls'],
      url: jsbin.static + '/js/vendor/livescript.js',
      init: function livescript(ready) {
        getScript(jsbin.static + '/js/vendor/codemirror5/mode/livescript/livescript.js', ready);
      },
      handler: function (source, resolve, reject) {
        var renderedCode = '';
        try {
          renderedCode = window.LiveScript.compile(source, {
            bare: true
          });
          resolve(renderedCode);
        } catch (e) {
          // index starts at 1
          var lineMatch = e.message.match(/on line (\d+)/) || [,];
          var line = parseInt(lineMatch[1], 10) || 0;
          if (line > 0) {
            line = line - 1;
          }
          var msg = e.message.match(/(.+) on line (\d+)$/) || [,];
          var errors = {
            line: line,
            ch: null,
            msg: msg[1]
          };

          reject([errors]);
        }
      }
    }),

    typescript: createProcessor({
      id: 'typescript',
      target: 'javascript',
      extensions: ['ts'],
      url: jsbin.static + '/js/vendor/typescript.min.js',
      init: passthrough,
      handler: function typescript(source, resolve, reject) {
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

        var compiler = new window.TypeScript.TypeScriptCompiler(outfile, outerr);

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
      url: jsbin.static + '/js/vendor/marked.min.js',
      init: function markdown(ready) {
        getScript(jsbin.static + '/js/vendor/codemirror5/mode/markdown/markdown.js', ready);
      },
      handler: function (source, resolve, reject) {
        try {
          resolve(window.marked(source));
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
        getScript(jsbin.static + '/js/vendor/codemirror5/mode/clike/clike.js', ready);
      },
      handler: function processing(source, resolve, reject) {
        try {
          var sketch = window.Processing.compile(source).sourceCode;
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
      url: jsbin.static + '/js/vendor/jade.js?1.4.2',
      init: function jade(ready) {
        getScript(jsbin.static + '/js/vendor/codemirror5/mode/jade/jade.js', ready);
      },
      handler: function jade(source, resolve, reject) {
        try {
          resolve(window.jade.compile(source, { pretty: true })());
        } catch (e) {
          console.log('Errors', e);
          // index starts at 1
          var lineMatch = e.message.match(/Jade:(\d+)/) || [,];
          var line = parseInt(lineMatch[1], 10) || 0;
          if (line > 0) {
            line = line - 1;
          }
          var msg = e.message.match(/\n\n(.+)$/) || [,];
          var errors = {
            line: line,
            ch: null,
            msg: msg[1]
          };

          reject([errors]);
        }
      }
    }),

    less: createProcessor({
      id: 'less',
      target: 'css',
      extensions: ['less'],
      url: jsbin.static + '/js/vendor/less.min.js',
      init: passthrough,
      handler: function less(source, resolve, reject) {
        window.less.render(source, function (error, result) {
          if (error) {
            // index starts at 1
            var line = parseInt(error.line, 10) || 0;
            var ch = parseInt(error.column, 10) || 0;
            if (line > 0) {
              line = line - 1;
            }
            if (ch > 0) {
              ch = ch - 1;
            }
            var errors = {
              line: line,
              ch: ch,
              msg: error.message
            };

            return reject([errors]);
          }
          resolve(result.css.trim());
        });
      }
    }),

    scss: createProcessor({
      id: 'scss',
      target: 'scss',
      extensions: ['scss'],
      // url: jsbin.static + '/js/vendor/sass/dist/sass.worker.js',
      init: passthrough,
        /* keeping old code for local version of scss if we ever want it again */
        // getScript(jsbin.static + '/js/vendor/codemirror3/mode/sass/sass.js', function () {
        // Sass.initialize(jsbin.static + '/js/vendor/sass/dist/worker.min.js');
      handler: throttle(debounceAsync(function sass(source, resolve, reject, done) {
        $.ajax({
          type: 'post',
          url: '/processor',
          data: {
            language: 'scss',
            source: source,
            url: jsbin.state.code,
            revision: jsbin.state.revision
          },
          success: function (data) {
            if (data.errors) {
              // console.log(data.errors);
              var cm = jsbin.panels.panels.css.editor;
              if (typeof cm.updateLinting !== 'undefined') {
                hintingDone(cm);
                var err = formatErrors(data.errors);
                cm.updateLinting(err);
              }
            } else if (data.result) {
              resolve(data.result);
            }
          },
          error: function (jqxhr) {
            reject(new Error(jqxhr.responseText));
          },
          complete: done
        });
        // RS: keep this as it's the client side version of SCSS support...
        // Sass.compile(source, function (result) {
        //   if (typeof result !== 'string') {
        //     reject(new Error('Error on line ' + result.line + ':\n' + result.message));
        //   } else {
        //     resolve(result.trim());
        //   }
        // });
      }), 500),
    }),

    sass: createProcessor({
      id: 'sass',
      target: 'sass',
      extensions: ['sass'],
      init: function (ready) {
        getScript(jsbin.static + '/js/vendor/codemirror5/mode/sass/sass.js', ready);
      },
      handler: throttle(debounceAsync(function (source, resolve, reject, done) {
        $.ajax({
          type: 'post',
          url: '/processor',
          data: {
            language: 'sass',
            source: source,
            url: jsbin.state.code,
            revision: jsbin.state.revision
          },
          success: function (data) {
            if (data.errors) {
              // console.log(data.errors);
              var cm = jsbin.panels.panels.css.editor;
              if (typeof cm.updateLinting !== 'undefined') {
                hintingDone(cm);
                var err = formatErrors(data.errors);
                cm.updateLinting(err);
              }
            } else if (data.result) {
              resolve(data.result);
            }
          },
          error: function (jqxhr) {
            reject(new Error(jqxhr.responseText));
          },
          complete: done
        });
      }), 500),
    }),

    babel: createProcessor({
      id: 'babel',
      target: 'js',
      extensions: ['es6'],
      url: jsbin.static + '/js/vendor/babel.min.js',
      init: function (ready) {
        ready();
      },
      handler: function babelhandle(source, resolve, reject) {
        try {
          resolve(babel.transform(source, { stage: 0 }).code);
        } catch (e) {
          console.error(e.message);
          reject([{
            line: e.loc.line - 1,
            ch: e.loc.column,
            msg: e.message.split('\n')[0].replace(new RegExp('\\\(' + e.loc.line + ':' + e.loc.column + '\\\)'), '(' + e.loc.column + ')')
          }]);
        }
      }
    }),

    myth: createProcessor({
      id: 'myth',
      target: 'css',
      extensions: ['myth'],
      url: jsbin.static + '/js/vendor/myth.min.js',
      init: function (ready) {
        ready();
      },
      handler: function (source, resolve, reject) {
        try {
          resolve(window.myth(source));
        } catch (e) {
          // index starts at 1
          var line = parseInt(e.line, 10) || 0;
          var ch = parseInt(e.column, 10) || 0;
          if (line > 0) {
            line = line - 1;
          }
          if (ch > 0) {
            ch = ch - 1;
          }
          var errors = {
            line: line,
            ch: ch,
            msg: e.message
          };

          reject([errors]);
        }
      }
    }),

    stylus: createProcessor({
      id: 'stylus',
      target: 'css',
      extensions: ['styl'],
      url: jsbin.static + '/js/vendor/stylus.js',
      init: passthrough,
      handler: function stylus(source, resolve, reject) {
        window.stylus(source).render(function (error, result) {
          if (error) {
            // index starts at 1
            var lineMatch = error.message.match(/stylus:(\d+)/) || [,];
            var line = parseInt(lineMatch[1], 10) || 0;
            var msg = error.message.match(/\n\n(.+)\n$/) || [,];
            if (line > 0) {
              line = line - 1;
            }
            var errors = {
              line: line,
              ch: null,
              msg: msg[1]
            };

            return reject([errors]);
          }

          resolve(result.trim());
        });
      }
    }),

    clojurescript: (function() {

      var worker, resolveWorker, rejectWorker, initReady;

      /* do stuff after worker has finished setup */
      function workerReady(event) {
        if (event.data.name === 'ready') {
          worker.removeEventListener('message', workerReady, false);
          getScript(jsbin.static + '/js/vendor/codemirror5/mode/clojure/clojure.js', initReady);
        }
      }

      /* get result of evaluation
       * and wrap with quotes to prevent attempt to eval a string */
      function workerEval(event) {
        if (event.data.name === 'eval') {
          worker.removeEventListener('message', workerEval, false);
          resolveWorker(event.data.result);
        }
      }

      return createProcessor({
        id: 'clojurescript',
        target: 'js',
        extensions: ['clj', 'cljs'],
        init: function clojurescript(ready) {

          // init worker
          if (window.Worker) {
            initReady = ready;
            worker = new Worker(jsbin.static + '/js/workers/cljs-worker.js');
            worker.addEventListener('error', rejectWorker, false);
            worker.addEventListener('message', workerReady, false);
            worker.postMessage({ name: 'cljs', path: jsbin.static + '/js/vendor/cljs.js' });
          } else {
            alert('Web Workers API is not supported http://caniuse.com/#feat=webworkers');
          }
        },
        handler: function (source, resolve, reject) {
          try {
            /* send code to worker
             * and alias promise functions to be used in upper scope */
            resolveWorker = resolve;
            rejectWorker = reject;
            worker.addEventListener('message', workerEval, false);
            worker.postMessage({ name: 'eval', code: source });
          } catch (e) {
            console.error(e);
          }
        }
      })
    })(),

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
          SourceMapConsumer = window.traceur.outputgeneration.SourceMapConsumer;
          SourceMapGenerator = window.traceur.outputgeneration.SourceMapGenerator;
          ProjectWriter = window.traceur.outputgeneration.ProjectWriter;
          ErrorReporter = window.traceur.util.ErrorReporter;
          ready();
        },
        handler: function (source, resolve, reject) {
          hasError = false;

          var reporter = new ErrorReporter();
          reporter.reportMessageInternal = function(location, kind, format, args) {
            reject(new Error(ErrorReporter.format(location, format, args)));
          };

          var url = location.href;
          var project = new window.traceur.semantics.symbols.Project(url);
          var name = 'jsbin';

          var sourceFile = new window.traceur.syntax.SourceFile(name, source);
          project.addFile(sourceFile);
          var res = window.traceur.codegeneration.Compiler.compile(reporter, project, false);

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

  var $panelButtons = $('#panels');

  var $processorSelectors = $('div.processorSelector').each(function () {
    var panelId = this.getAttribute('data-type'),
        $el = $(this),
        $label = $el.closest('.label').find('strong a'),
        originalLabel = $label.text();

    $el.find('a').click(function (e) {
      var panel = jsbin.panels.panels[panelId];
      var $panelButton = $panelButtons.find('a[href$="' + panelId + '"]');

      e.preventDefault();
      var target = this.hash.substring(1),
          label = $(this).text(),
          labelData = $(this).data('label');
      if (target !== 'convert') {
        $panelButton.html(labelData || label);
        $label.text(label);
        if (target === panelId) {
          jsbin.processors.reset(panelId);
          render();
        } else {
          jsbin.processors.set(panelId, target, render);
        }
      } else {
        $label.text(originalLabel);
        $panelButton.html(originalLabel);
        panel.render().then(function (source) {
          jsbin.processors.reset(panelId);
          panel.setCode(source);
        });
      }
    }).bind('select', function (event, value) {
      if (value === this.hash.substring(1)) {
        var $panelButton = $panelButtons.find('a[href$="' + panelId + '"]');
        var $this = $(this);
        $label.text($this.text());
        $panelButton.html($this.data('label') || $this.text());
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
    var smartIndent = processorName !== 'jsx';

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
      // delete jsbin.state.processors[panelId];
      jsbin.state.processors[panelId] = panelId;
      delete panel.type;
    }

    // linting
    var mmMode = cmMode;
    if (cmMode === 'javascript') {
      mmMode = 'js';
    }
    if (cmMode === 'htmlmixed') {
      mmMode = 'html';
    }
    var isHint = panel.editor.getOption('lint');
    if (isHint) {
      panel.editor.lintStop();
    }
    if (jsbin.settings[mmMode + 'hint']) {
      panel.editor.setOption('mode', cmMode);
      if (typeof hintingDone !== 'undefined') {
        panel.editor.setOption('mode', cmMode);
        hintingDone(panel.editor);
      }
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
    if (!id) {
      return defaultProcessor;
    }
    return jsbin.processors[id];
  };

  processors.by = processorBy;

  return processors;

}());
