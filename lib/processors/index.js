'use strict';
var path     = require('path'),
    root     = path.resolve(path.join(__dirname, '../../')),
    jade     = require('jade'),
    coffee   = require(root + '/public/js/vendor/coffee-script').CoffeeScript,
    jsx      = require(root + '/public/js/vendor/JSXTransformer'),
    markdown = require(root + '/public/js/vendor/markdown'),
    less     = require('less'),
    stylus   = require('stylus'),
    RSVP     = require('rsvp'),
    exec     = require('child_process').exec;

var processors = module.exports = {
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
    'styl': 'text/css',
    'less': 'text/css',
    'sass': 'text/css',
    'scss': 'text/css',
    '_default': 'text/plain'
  },

  aliases: {
    'md': 'markdown',
    'mdown': 'markdown',
    'coffee': 'coffeescript',
    'pde': 'processing',
    'ts': 'typescript',
    'styl': 'stylus',
  },

  lookup: {
    'markdown': 'html',
    'jade': 'html',
    'coffeescript': 'javascript',
    'jsx': 'javascript',
    'pde': 'javascript',
    'ts': 'javascript',
    'stylus': 'css',
    'less': 'css',
    'sass': 'css',
    'scss': 'css',
  },

  run: function (language, source) {
    return new RSVP.Promise(function (resolve, reject) {
      console.log('node ' + __dirname);
      var child = exec('node', [__dirname], {
        // timeout: 2000
      });
      var output = '';

      child.stderr.on('data', function (data) {
        console.error(language + ' processor errors');
        console.error(data);
      });

      child.stdout.on('data', function (message) {
        console.log('output', message);
        output += message;
      });

      child.on('exit', function () {
        console.log('exit');
        resolve(output);
      });

      child.stdin.write(JSON.stringify({ language: language, source: source }) + '\n');
    });
  },

  coffeescript: function (source) {
    return new RSVP.Promise(function (resolve, reject) {
      try {
        resolve(coffee.compile(source, {
          bare: true
        }));
      } catch (e) {
        console.error(e.message);
        reject(e);
      }
    });
  },
  jsx: function(source) {
    return new RSVP.Promise(function (resolve, reject) {
      try {
        resolve(jsx.transform(source).code);
      } catch (e) {
        console.error(e.message);
        reject(e);
      }
    });
  },
  jade: function (source) {
    return new RSVP.Promise(function (resolve, reject) {
      try {
        resolve(jade.compile(source, { pretty: true })());
      } catch (e) {
        reject(e);
      }
    });
  },
  markdown: function (source) {
    return new RSVP.Promise(function (resolve, reject) {
      try {
        resolve(markdown.toHTML(source));
      } catch (e) {
        reject(e);
      }
    });
  },
  less: function (source) {
    return new RSVP.Promise(function (resolve, reject) {
      try {
        less.Parser().parse(source, function (err, result) {
          if (err) {
            console.error(err);
            return reject(err);
          }
          resolve(result.toCSS().trim());
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  stylus: function (source) {
    return new RSVP.Promise(function (resolve, reject) {
      try {
        stylus(source).render(function (err, result) {
          if (err) {
            console.error(err);
            return reject(err);
          }
          resolve(result.trim());
        });
      } catch (e) {
        reject(e);
      }
    });
  }
};

if (!module.parent) {
  console.log('running');
  process.stdin.setEncoding('utf8');

  console.log('running child');
  var message = '';
  process.stdin.on('readable', function(event) {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      message += chunk;
    }
  }).on('end', function () {
    console.log('got ', message);
  });

    // console.log('got message', event);
    // if (event.language && typeof processors[event.language] === 'function') {
      // processors[event.language](event.source).then(function (output) {
      //   process.send(output);
      // }, function (error) {
      //   console.error(error);
      // }).then(function () {
      //   process.exit(0);
      // });
    // }
  // });
}
