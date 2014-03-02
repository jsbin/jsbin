/*global Module, FS, ALLOC_STACK*/
/*jshint strict:false*/
var Sass = {
  style: {
    nested: 0,
    expanded: 1,
    compact: 2,
    compressed: 3
  },
  comments: {
    'none': 0,
    'default': 1
  },
  _options: {
    style: 0,
    comments: 0
  },
  _files: {},
  _path: '/sass/',

  options: function(options) {
    if (typeof options !== 'object') {
      return;
    }

    Object.keys(options).forEach(function(key) {
      switch (key) {
        case 'style':
          Sass._options[key] = Number(options[key]);
          break;
        case 'comments':
          Sass._options[key] = Number(!!options[key]);
          break;
      }
    });
  },

  _absolutePath: function(filename) {
    return Sass._path + (filename.slice(0, 1) === '/' ? filename.slice(1) : filename);
  },

  _createPath: function(parts) {
    var base = [];

    while (parts.length) {
      var directory = parts.shift();
      try {
        FS.createFolder(base.join('/'), directory, true, true);
      } catch(e) {
        // IGNORE file exists errors
      }

      base.push(directory);
    }
  },

  _ensurePath: function(filename) {
    var parts = filename.split('/');
    parts.pop();
    if (!parts.length) {
      return;
    }

    try {
      FS.stat(parts.join('/'));
      return;
    } catch(e) {
      Sass._createPath(parts);
    }
  },

  writeFile: function(filename, text) {
    var path = Sass._absolutePath(filename);
    try {
      Sass._ensurePath(path);
      FS.writeFile(path, text);
      Sass._files[path] = filename;
      return true;
    } catch(e) {
      return false;
    }
  },

  readFile: function(filename) {
    var path = Sass._absolutePath(filename);
    try {
      return FS.readFile(path, {encoding: 'utf8'});
    } catch(e) {
      return undefined;
    }
  },

  listFiles: function() {
    return Object.keys(Sass._files).map(function(path) {
      return Sass._files[path];
    });
  },

  removeFile: function(filename) {
    var path = Sass._absolutePath(filename);
    try {
      FS.unlink(path);
      delete Sass._files[path];
      return true;
    } catch(e) {
      return false;
    }
  },

  compile: function(text) {
    try {
      // in C we would use char *ptr; foo(&ptr) - in EMScripten this is not possible,
      // so we allocate a pointer to a pointer on the stack by hand
      var errorPointerPointer = Module.allocate([0], 'i8', ALLOC_STACK);
      var result = Module.ccall(
        // C/++ function to call
        'sass_compile_emscripten',
        // return type
        'string',
        // parameter types
        ['string', 'number', 'number', 'string', 'i8'],
        // arguments for invocation
        [text, Sass._options.style, Sass._options.comments, Sass._path, errorPointerPointer]
      );
      // this is equivalent to *ptr
      var errorPointer = Module.getValue(errorPointerPointer, '*');
      // error string set? if not, it would be NULL and therefore 0
      if (errorPointer) {
        // pull string from pointer

        /*jshint camelcase:false*/
        errorPointer = Module.Pointer_stringify(errorPointer);
        /*jshint camelcase:true*/

        var error = errorPointer.match(/^source string:(\d+):/);
        var message = errorPointer.slice(error[0].length).replace(/(^\s+)|(\s+$)/g, '');
        // throw new Error(message, 'string', error[1]);
        return {
          line: Number(error[1]),
          message: message
        };
      }

      return result;
    } catch(e) {
      // in case libsass.js was compiled without exception support
      return {
        line: null,
        message: 'Unknown Error: you need to compile libsass.js with exceptions to get proper error messages'
      };
    }
  }
};
