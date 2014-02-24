'use strict';
var fs = require('fs'),
    path = require('path'),
    version = require('../package').version,
    semver = require('semver'),
    RSVP = require('rsvp'),
    script = process.argv[1];

if (process.argv[2] && semver.valid(process.argv[2]) === process.argv[2]) {
  main(process.argv[2]);
} else if (process.argv[2] === 'commit') {
  fs.readFile(path.join(__dirname, 'pre-version'), 'utf8', function (err, v) {
    if (err) {
      // nothing to do
      process.exit(1);
    }
    fs.unlink(path.join(__dirname, 'pre-version'));
    main(v.trim());
  });
} else {
  console.log('Either test with `' + script + ' <prev-version>`\nor `' + script + ' commit` to run in live mode');
}

function main(oldVersion) {
  console.log('[jsbin post-update] Testing if there is any migration from ' + oldVersion + ' -> ' + version);

  return getVersions(oldVersion, version);
}

function getVersionUpdate(file) {
  return new RSVP.Promise(function (resolve) {
    var dir = path.join(__dirname, 'upgrade', file);
    fs.stat(dir, function (err, stat) {
      if (stat.isDirectory()) {
        // test for semver
        if (semver.valid(file) === file) {
          resolve(file);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
}

function getVersions(oldVersion, version) {
  var dir = path.join(__dirname, 'upgrade');
  fs.readdir(dir, function (err, files) {
    var promises = [];

    files.forEach(function (file) {
      promises.push(getVersionUpdate(file));
    });

    RSVP.all(promises).then(function (files) {
      files.filter(function (file) {
        return file !== false;
      }).sort(function (a, b) {
        return semver.gt(a, b) ? 1 : -1;
      }).forEach(function (file) {
        if (semver.satisfies(file, '>=' + oldVersion + ' <' + version)) {
          console.log('[jsbin post-update] Run everything for ' + file + ' migration:');
          var dir = path.join(__dirname, 'upgrade', file);
          fs.readdirSync(dir).forEach(function (file) {
            console.log('  - ' + path.join(dir, file));
          });
        }
      });
    });

  });
}
