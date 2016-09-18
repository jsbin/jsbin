var glob = require('glob');
var path = require('path');

var seleniumJar = glob.sync(path.join(
  'node_modules', 'selenium-standalone', '.selenium', 'selenium-server', '*.jar'))[0];

if (!seleniumJar) {
  throw new Error('Can\'t find selenium jar, try running "npm run selenium:install"');
}

const TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER;

module.exports = {
  "src_folders": ["test/e2e/specs"],

  "test_settings": {
    "local": {
      "launch_url": "http://localhost:3000/",
      "selenium": {
        "start_process": true,
        "server_path": seleniumJar
      }
    },
    "remote": {
      desiredCapabilities: {
        browserName: "chrome",
        platform: "OS X 10.11",
        version: "latest",
        build: 'build-' + TRAVIS_JOB_NUMBER,
        'tunnel-identifier': TRAVIS_JOB_NUMBER,
        "username": process.env.SAUCE_USERNAME,
        "access_key": process.env.SAUCE_ACCESS_KEY
      },
      "launch_url": "http://localhost:3000/",
      "selenium_port": 80,
      "selenium_host": "ondemand.saucelabs.com",
      "silent": true,
      "screenshots": {
        "enabled": false,
        "path": ""
      }
    }
  },
  "custom_assertions_path": "test/e2e/assertions"
};
