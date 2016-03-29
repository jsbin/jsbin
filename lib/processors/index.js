'use strict';

var RSVP = require('rsvp');
var config  = require('../config');
var undefsafe = require('undefsafe');

var processors = {
  // list of available processors on the serverside
  supports: ['markdown', 'jade', 'coffeescript', 'less', 'jsx', 'myth', 'stylus', 'livescript', 'babel', 'clojurescript'],

  support: function (language) {
    return processors.supports.indexOf(language) !== -1;
  },

  mime: {
    'js': 'application/javascript',
    'css': 'text/css',
    'html': 'text/html',
    'md': 'text/x-markdown',
    'mdown': 'text/x-markdown',
    'markdown': 'text/x-markdown',
    'clojurescript': 'application/javascript',
    'coffee': 'application/javascript',
    'coffeescript': 'application/javascript',
    'jsx': 'application/javascript',
    'es6': 'application/javascript',
    'json': 'application/json',
    'ts': 'application/javascript',
    'ls': 'application/javascript',
    'styl': 'text/css',
    'less': 'text/css',
    'sass': 'text/css',
    'scss': 'text/css',
    'myth': 'text/css',
    'svg': 'image/svg+xml',
    '_default': 'text/plain'
  },

  aliases: {
    'md': 'markdown',
    'mdown': 'markdown',
    'coffee': 'coffeescript',
    'pde': 'processing',
    'ts': 'typescript',
    'styl': 'stylus',
    'es6': 'babel',
    'ls': 'livescript'
  },

  lookup: {
    'markdown': 'html',
    'jade': 'html',
    'coffeescript': 'javascript',
    'jsx': 'javascript',
    'pde': 'javascript',
    'ts': 'javascript',
    'livescript': 'javascript',
    'stylus': 'css',
    'less': 'css',
    'sass': 'css',
    'scss': 'css',
    'myth': 'css',
    'babel': 'javascript',
    'es6': 'javascript',
  },
};

processors.run = (function () {
  if (!undefsafe(config, 'processor.address')) {
    return require('./fork');
  }

  try {
    var run = require('./socket');
    processors.supports.push('scss', 'sass');
    return run;
  } catch (e) {
    return require('./fork');
  }
})();

module.exports = processors;

if (!module.parent) {
  process.on('message', function (event) {
    var processor = require('./' + event.language);
    if (event.language && typeof processor === 'function') {
      processor(event.data).then(function (output) {
        process.send(JSON.stringify(output));
      }, function (error) {
        console.error(event.language, 'error:: ', error);
      }).then(function () {
        process.exit(0);
      });
    }
  });
}
