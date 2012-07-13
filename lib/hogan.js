var fs = require('fs'),
    hogan = require('hogan.js');

// Create a Hogan/Mustache handler for templates.
exports.renderer = function renderer(path, options, fn) {
  fs.readFile(path, 'utf8', function (err, template) {
    if (err) {
      return fn(err);
    }

    try {
      var compiled = exports.templates[path];
      if (!compiled) {
        compiled = exports.templates[path] = hogan.compile(template);
      }

      fn(null, compiled.render(options));
    } catch (error) {
      fn(error);
    }
  });
};

exports.templates = {};
