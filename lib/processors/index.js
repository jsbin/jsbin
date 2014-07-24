'use strict';

var RSVP = require('rsvp');

var processors = {
  // list of available processors on the serverside
  supports: ['markdown', 'jade', 'coffeescript', 'less', 'jsx', 'myth', 'stylus', 'livescript'],

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
    'coffee': 'application/javascript',
    'coffeescript': 'application/javascript',
    'jsx': 'application/javascript',
    'json': 'application/json',
    'ts': 'application/javascript',
    'livescript': 'application/javascript',
    'styl': 'text/css',
    'less': 'text/css',
    'sass': 'text/css',
    'scss': 'text/css',
    'myth': 'text/css',
    '_default': 'text/plain'
  },

  aliases: {
    'md': 'markdown',
    'mdown': 'markdown',
    'coffee': 'coffeescript',
    'pde': 'processing',
    'ts': 'typescript',
    'styl': 'stylus',
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
    'myth': 'css'
  },
};

processors.run = (function () {
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
      processor(event.source).then(function (output) {
        process.send(output);
      }, function (error) {
        console.error(error);
      }).then(function () {
        process.exit(0);
      });
    }
  });
}
