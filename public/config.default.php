<?php
// Make a copy of this file and name it config.local.php, then fill in
// the options with your environment specific settings.

// database settings
define('DB_NAME', 'jsbin');
define('DB_USER', 'root');      // Your MySQL username
define('DB_PASSWORD', '');      // ...and password
define('DB_HOST', 'localhost'); // 99% chance you won't need to change this value

// change this to suite your offline detection
define('OFFLINE', is_dir('/Users/'));

define('HOST', $_SERVER['HTTP_HOST']);

// Path prefix for all jsbin urls.
define('PATH', '/');

// The full url to the root page of the app.
define('ROOT', 'http://' . HOST . BASEPATH);

// wishing PHP were more like JavaScript...wishing I was able to use Node.js they way I had wanted...
define('VERSION', OFFLINE ? 'debug' : trim(file_get_contents('VERSION')));
?>
