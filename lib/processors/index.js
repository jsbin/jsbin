// 1. preload all the available preprocessors
var path     = require('path'),
    root     = path.resolve(path.join(__dirname, '../../')),
    jade     = require('jade'),
    coffee   = require(root + '/public/js/vendor/coffee-script').CoffeeScript,
    jsx      = require(root + '/public/js/vendor/JSXTransformer'),
    markdown = require(root + '/public/js/vendor/markdown'),
    less     = require('less');
    //stylus   = require('stylus');


module.exports = {
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

  coffeescript: function (source) {
    var renderedCode = '';
    try {
      renderedCode = coffee.compile(source, {
        bare: true
      });
    } catch (e) {
      if (console) {
        console.error(e.message);
      }
    }
    return renderedCode;
  },
  jsx: function(source) {
    debugger;
    var renderedCode = '';
    try {
      renderedCode = jsx.transform(source).code;
    } catch (e) {
      if (console) {
        console.error(e.message);
      }
    }
    return renderedCode;
  },
  jade: function (source) {
    try {
      source = jade.compile(source, { pretty: true })();
    } catch (e) {}

    return source;
  },
  markdown: function (source) {
    try {
      source = markdown.toHTML(source);
    } catch (e) {}

    return source;
  },
  less: function (source) {
    var css = '';
    try {
      less.Parser().parse(source, function (err, result) {
        if (err) {
          if (console) {
            console.error(err);
          }
          return source;
        }
        css = result.toCSS().trim();
      });
    } catch (e) {}
    return css;
  },
  stylus: function (source) {
    var css = '';

    return source;
/*

    // disabled due to huge infinite loop bug... ::sigh::
    try {
      stylus(source).render(function (err, result) {
        if (err) {
          if (console) {
            console.error(err);
          }
          return;
        }
        css = result.trim();
      });
    } catch (e) {}

    return css;
*/
  }
};
