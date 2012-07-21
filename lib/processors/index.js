// 1. preload all the available preprocessors
var path     = require('path'),
    root     = path.resolve(path.join(__dirname, '../../')),
    jade     = require('jade'),
    coffee   = require(root + '/public/js/vendor/coffee-script'),
    markdown = require(root + '/public/js/vendor/markdown'),
    less     = require('less'),
    stylus   = require('stylus');


module.exports = {
  coffee: function (source) {
    var renderedCode = '';
    try {
      renderedCode = coffee.compile(source, {
        bare: true
      });
    } catch (e) {
      console && console.error(e.message);
    }
    return renderedCode;
  },
  jade: function (source) {
    console.log(jade);
    return jade.compile(source, { pretty: true })();
  },
  markdown: function (source) {
    return markdown.toHTML(source);
  },
  less: function (source) {
    var css = '';

    less.Parser().parse(source, function (err, result) {
      if (err) {
        console && console.error(err);
        return source;
      }
      css = result.toCSS().trim();
    });
    return css;
  },
  stylus: function (source) {
    var css = '';

    stylus(source).render(function (err, result) {
      if (err) {
        console && console.error(err);
        return;
      }
      css = result.trim();
    });
    return css;
  }
};