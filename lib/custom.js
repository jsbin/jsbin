// Loads custom settings from the public/custom directory. This folder should
// include a config.json file with any of the following settings:
//
// css      - A url to a custom css file that will be added to the page.
// settings - A settings object that will be assigned to the jsbin object
//            in the page.
//
// Also files named default.html/css/js can be included to provided the default
// content for the respective panels.
var fs = require('fs'),
    path = require('path'),
    custom = path.join(__dirname, '..', 'public', 'custom');

fs.readdirSync(custom).forEach(function (customdir) {
  var custompath = path.join(custom, customdir),
      stats = fs.statSync(custompath);

  if (stats.isDirectory()) {
    fs.readdirSync(custompath).forEach(function (filename) {
      var defaults = ['html', 'css', 'js'],
          json = path.join(custompath, 'config.json'),
          extracted = {};

      try {
        extracted = require(json);
        extracted.defaults = {};

        defaults.forEach(function (ext) {
          var pathname = path.join(custompath, 'default.' + ext),
              key = ext === 'js' ? 'javascript' : ext,
              contents = null;

          try {
            contents = fs.readFileSync(pathname).toString('utf8');
          } catch (e) {}

          extracted.defaults[key] = contents;
        });

        module.exports[customdir] = extracted;
      } catch (e) {
        console.warn('Unable to load custom config: %s', json);
      }
    });
  }
});
