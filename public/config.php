<?php
// Pull in the local settings. Fallback to the defaults.
$locals = array();
$package  = json_decode(file_get_contents('../package.json'), true);
$defaults = json_decode(file_get_contents('../config.default.json'), true);
if (file_exists('../config.local.json')) {
  $locals = json_decode(file_get_contents('../config.local.json'), true);
}

$settings = array_merge($defaults, $locals);

define('PRODUCTION', 'production');
define('DEVELOPMENT', 'development');

// database settings
define('DB_NAME',     $settings['db.name']);
define('DB_USER',     $settings['db.user']); // Your MySQL username
define('DB_PASSWORD', $settings['db.pass']); // ...and password
define('DB_HOST',     $settings['db.host']); // 99% chance you won't need to change this value

// change this to suite your offline detection
define('IS_PRODUCTION', $settings['env'] === PRODUCTION);

define('HOST', $settings['url.host']);

// Path prefix for all jsbin urls.
define('PATH', $settings['url.prefix']);

// The full url to the root page of the app.
define('ROOT', ($settings['url.ssl'] ? 'https' : 'http') . '://' . HOST . PATH);

// wishing PHP were more like JavaScript...wishing I was able to use Node.js they way I had wanted...
define('VERSION', !IS_PRODUCTION ? 'debug' : $package['version']);

define('ANALYTICS_ID', $settings['analytics.id']);
?>
