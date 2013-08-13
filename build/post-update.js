var fs = require('fs'),
    path = require('path'),
    version = require('../package').version,
    semver = require('semver');

if (process.argv[2] && semver.valid(process.argv[2]) === process.argv[2]) {
  main(process.argv[2]);
} else {
  fs.readFile(path.join(__dirname, 'pre-version'), 'utf8', function (err, v) {
    if (err) {
      // nothing to do
      process.exit(1);
    }
    fs.unlink(path.join(__dirname, 'pre-version'));
    main(v.trim());
  });
}

function main(oldVersion) {
  console.log('[jsbin post-update] Testing if there is any migration from ' + oldVersion + ' -> ' + version);
  fs.readdir(path.join(__dirname, 'upgrade'), function (err, files) {
    files.forEach(function (file) {
      var dir = path.join(__dirname, 'upgrade', file);
      fs.stat(dir, function (err, stat) {
        if (stat.isDirectory()) {
          // test for semver
          if (semver.valid(file) === file) {
            if (semver.satisfies(file, oldVersion + ' - ' + version)) {
              console.log('[jsbin post-update] Run everything for ' + file + ' migration:');
              fs.readdir(dir, function (err, files) {
                files.forEach(function (file) {
                  console.log('  - ' + path.join(dir, file));
                });
              });
            }
          }
        }
      });
    });
  });
}