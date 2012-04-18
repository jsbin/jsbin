var fs = require('fs'),
    path = require('path'),
    exists = fs.exists ? fs.exists : path.exists, // 0.7.x support
    re = {
      command: /\/\/= ([a-z]+) ([^\n]+)/ig,
      quotes: /"/g,
      brackets: /[<>]/g,
      cwd: new RegExp(process.cwd())
    },
    cache = {},
    includes = [],
    root = process.cwd(),
    cwd = process.cwd(),
    basepaths = [],
    completefile = '';

function main(filename, paths, complete) {
  if (typeof paths === 'function') {
    complete = paths;
    paths = null;
  }

  if (paths && ({}).toString.call(paths).indexOf('Array') === -1) {
    paths = [paths];
  }

  if (filename) {
    exists(filename, function (ok) {
      if (!ok) {
        return usage();
      }

      filename = path.resolve(filename);
      root = path.dirname(filename);
      process.cwd(root);

      basepaths = paths || [root];

      completefile = sprocketize(filename);
      // complete(completefile);
      console.log(completefile);
    });
  } else {
    usage();
  }
}

function usage() {
  console.log('Usage:');
  console.log('  $ gobo <yourfile.js>');
  console.log();
  process.exit();
}

function sprocketize(filename) {
  var data = fs.readFileSync(filename, 'utf8'),
      found = false;

  if (cache[filename]) return;
  cache[filename] = true;

  data = data.replace(re.command, function (match, cmd, script) {
    if (cmd === 'require') {
      if (script.substring(0, 1) === '"') {
        script = script.replace(re.quotes, '') + '.js';
        return '// ' + filename + '\n' + sprocketize(path.join(path.dirname(filename), script));
      } else if (script.substring(0, 1) === '<') {
        script = script.replace(re.brackets, '') + '.js';

        if (basepaths.length) {
          for (var i = 0; i < basepaths.length; i++) {
            var packagefilename = path.join(root, basepaths[i], script);
                stat = null;

            try {
              stat = fs.statSync(packagefilename);
              if (!stat.isDirectory()) {
                return '// ' + filename + '\n' + sprocketize(packagefilename);
                found = true;
                break;
              }
            } catch (e) {}
          }
          if (!found) {
            throw new Error('unable to find ' + packagefilename);
            return '';
          }
        } 
      }
    }
  });
  return data;
}

if (!module.parent) {
  var args = process.argv.slice(2);
  main(args.shift(), args);
} else {
  module.exports = main;
}