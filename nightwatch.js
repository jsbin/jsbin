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
            },
            "globals": {
                "waitForConditionTimeout": 1000,
                "defaultTimeout": 150,
                "defaultTimeoutMax": 1000,
                "buttonUrls":{
                    "menuHelpTips":"http://jsbin.com/help",
                    "menuFeedback":"https://github.com/jsbin/jsbin/issues/new",
                    "menuFork":"https://gratipay.com/jsbin/",
                    "menuFollowJsbin" : "https://twitter.com/js_bin"
                },
                "github":{"login":"", "password":""},
                "jsbin":{"login":"yourmail", "password":"123"}
            }
        },
        "remote": {
            desiredCapabilities: {
                name: 'test-example',
                browserName: "firefox",
                platform: "OS X 10.11",
                version: "45.0",
                build: 'build-' + TRAVIS_JOB_NUMBER,
                'tunnel-identifier': TRAVIS_JOB_NUMBER,
                "username": "",
                "access_key": ""
            },
            "launch_url": "http://localhost:3000/",
            "selenium_port": 80,
            "selenium_host": "ondemand.saucelabs.com",
            "silent": true,
            "javascriptEnabled": true,
            "screenshots": {
                "enabled": false,
                "path": ""
            },
            "use_ssl": false,
            "output": true,
            "globals": {
                "waitForConditionTimeout": 1000,
                "defaultTimeout": 1000
            }
        }
    },
    "custom_assertions_path": "test/e2e/assertions",
    "custom_commands_path": "test/e2e/commands"
};
