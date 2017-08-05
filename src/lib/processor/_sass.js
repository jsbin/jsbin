var SassWorker = require('worker-loader!sass.js/dist/sass.worker.js'); // eslint-disable-line import/no-webpack-loader-syntax

var noop = function() {};
var slice = [].slice;
// defined upon first Sass.initialize() call
var globalWorkerUrl;

function Sass(workerUrl) {
  if (!globalWorkerUrl) {
    globalWorkerUrl = workerUrl;
  }

  // bind all functions
  // we're doing this because we used to have a single hard-wired instance that allowed
  // [].map(Sass.removeFile) and we need to maintain that for now (at least until 1.0.0)
  for (var key in this) {
    if (typeof this[key] === 'function') {
      this[key] = this[key].bind(this);
    }
  }

  this._callbacks = {};
  this._worker = new Worker(workerUrl || globalWorkerUrl);
  this._worker.addEventListener('message', this._handleWorkerMessage, false);
}

// allow setting the workerUrl before the first Sass instance is initialized,
// where registering the global workerUrl would've happened automatically
Sass.setWorkerUrl = function(workerUrl) {
  globalWorkerUrl = workerUrl;
};

Sass.style = {
  nested: 0,
  expanded: 1,
  compact: 2,
  compressed: 3,
};

Sass.comments = {
  none: 0,
  default: 1,
};

Sass.prototype = {
  style: Sass.style,
  comments: Sass.comments,

  destroy: function() {
    this._worker && this._worker.terminate();
    this._worker = null;
    this._callbacks = {};
    this._importer = null;
  },

  _handleWorkerMessage: function(event) {
    if (event.data.command) {
      this[event.data.command](event.data.args);
    }

    this._callbacks[event.data.id] &&
      this._callbacks[event.data.id](event.data.result);
    delete this._callbacks[event.data.id];
  },

  _dispatch: function(options, callback) {
    if (!this._worker) {
      throw new Error('Sass worker has been terminated');
    }

    options.id = 'cb' + Date.now() + Math.random();
    this._callbacks[options.id] = callback;
    this._worker.postMessage(options);
  },

  _importerInit: function(args) {
    // importer API done callback pushing results
    // back to the worker
    var done = function done(result) {
      this._worker.postMessage({
        command: '_importerFinish',
        args: [result],
      });
    }.bind(this);

    try {
      this._importer(args[0], done);
    } catch (e) {
      done({ error: e.message });
      throw e;
    }
  },

  importer: function(importerCallback, callback) {
    if (typeof importerCallback !== 'function' && importerCallback !== null) {
      throw new Error('importer callback must either be a function or null');
    }

    // callback is executed in the main EventLoop
    this._importer = importerCallback;
    // tell worker to activate importer callback
    this._worker.postMessage({
      command: 'importer',
      args: [Boolean(importerCallback)],
    });

    callback && callback();
  },
};

var commands =
  'writeFile readFile listFiles removeFile clearFiles lazyFiles preloadFiles options compile compileFile';
commands.split(' ').forEach(function(command) {
  Sass.prototype[command] = function() {
    var callback = slice.call(arguments, -1)[0];
    var args = slice.call(arguments, 0, -1);
    if (typeof callback !== 'function') {
      args.push(callback);
      callback = noop;
    }

    this._dispatch(
      {
        command: command,
        args: args,
      },
      callback
    );
  };
});

export default Sass;
