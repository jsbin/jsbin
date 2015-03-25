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
    http = require('http'),
    url = require('url'),
    config = require('./config'),
    custom = path.join(__dirname, '..', 'public', 'custom');

if (config.whiteLabel) {
  fs.readdirSync(custom).forEach(function (customdir) {
    var custompath = path.join(custom, customdir),
        stats = fs.statSync(custompath);

    if (stats.isDirectory()) {
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

        console.log('Loaded custom config: %s', extracted.name);

        module.exports[customdir] = extracted;
      } catch (e) {
        console.warn('Unable to load custom config: %s', json);
      }
    }
  });
} else if (config.customisation) {
  var defaults = ['html', 'css', 'js'],
      extracted = {};

  try {
    extracted = config.customisation;
    if (extracted.defaults && extracted.defaults.root) {

    } else {
      console.warn('Tried to load customisation, but no base URL was found to load default panel content from');
    }

    defaults.forEach(function (ext) {
      // skip this extention if it's already in the config

      var key = ext === 'js' ? 'javascript' : ext;

      // If it's a path to an existing file, extract contents via fs read
      if (extracted.defaults[ext] &&
          extracted.defaults[ext].indexOf('http') === -1 &&
          fs.existsSync(extracted.defaults[ext])) {

        try {
          extracted.defaults[key] = fs.readFileSync(extracted.defaults[ext], 'utf8');
          console.log('Custom %s content loaded', key);
        } catch(e) {
          console.log('Failed to load custom %s content');
        }
        
      // Otherwise...
      } else if(!extracted.defaults[ext] ||
            extracted.defaults[ext].indexOf('http') === 0) {
        var uri = extracted.defaults[ext] || url.resolve(config.customisation.defaults.root, 'default.' + ext);
        var contents = '';

        http.get(uri, function(res) {
          if (res.statusCode === 200) {
            res.on('data', function (chunk) {
              contents += chunk;
            }).on('end', function () {
              extracted.defaults[key] = contents;
              console.log('Custom %s content loaded', key);
            });
          } else {
            console.log('Could not load %s: %s', uri, res.statusCode);
          }
        }).on('error', function(e) {
          console.log('Failed to load %s: %s', uri, e.message);
        });
      }

    });

    console.log('Loading custom config: %s', extracted.name);

    module.exports = { default: extracted };
  } catch (e) {
    console.warn('Unable to load custom config: %s', e.message);
  }
}
