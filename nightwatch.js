var glob = require('glob');
var path = require('path');

var seleniumJar = glob.sync(path.join(
  'node_modules', 'selenium-standalone', '.selenium', 'selenium-server', '*.jar'))[0];

if (!seleniumJar) {
  throw new Error('Can\'t find selenium jar, try running "npm run selenium:install"');
}

module.exports = {
  "src_folders": ["test/e2e"],
  "selenium": {
    "start_process": true,
    "server_path": seleniumJar
  },
  "test_settings": {
    "default": {
      "launch_url": "http://127.0.0.1:3000/"
    }
  }
};
