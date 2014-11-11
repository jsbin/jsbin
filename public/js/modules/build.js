var fs = require('fs');
var browserify = require('browserify');

fs.readdir(__dirname, function (err, files) {
  // remove this file from list
  files.splice(files.indexOf(__filename) - 1, 1);
  files.forEach(function (file) {
    var path = __dirname + '/' + file + '/';
    var b = browserify({
      standalone: file,
      basedir: path
    });
    var bundleFile = fs.createWriteStream(path + 'bundle.js');
    b.add(path + 'index.js').bundle().pipe(bundleFile);
  });
});
