<?php
// Pull in the local settings. Fallback to the defaults.
$locals = array();
$package  = json_decode(file_get_contents('../package.json'), true);
$defaults = json_decode(file_get_contents('../config.default.json'), true);
if (file_exists('../config.local.json')) {
  $locals = json_decode(file_get_contents('../config.local.json'), true);
}

function merge_config($arr1, $arr2) {
  foreach ($arr2 as $key => $val) {
    if (is_array($val)) {
      $arr1[$key] = merge_config($arr1[$key], $val);
    } else {
      $arr1[$key] = $val;
    }
  }
  return $arr1;
}

$settings = merge_config($defaults, $locals);
$database = $settings['store']['mysql'];
$url      = $settings['url'];

define('PRODUCTION',  'production');
define('DEVELOPMENT', 'development');

// database settings
define('DB_NAME',     $database['database']);
define('DB_USER',     $database['user']);
define('DB_PASSWORD', $database['password']);
define('DB_HOST',     $database['host']);

// change this to suite your offline detection
define('IS_PRODUCTION', $settings['env'] === PRODUCTION);

define('HOST', $url['host']);

// Path prefix for all jsbin urls.
define('PATH', $url['prefix']);

// The full url to the root page of the app.
define('ROOT', ($url['ssl'] ? 'https' : 'http') . '://' . HOST . preg_replace('/\/$/', '', PATH));
define('STATIC_URL', (isset($url['static']) && $url['static'] !== false) ? $url['static'] : ROOT);

// wishing PHP were more like JavaScript...wishing I was able to use Node.js they way I had wanted...
define('VERSION', !IS_PRODUCTION ? 'debug' : $package['version']);

// Used for hashing session keys.
define('SECRET_KEY', $settings['session']['secret']);

define('ANALYTICS_ID', $settings['analytics']['id']);
?>
