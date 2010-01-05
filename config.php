<?php
// database settings
define('DB_NAME', 'jsbin');
define('DB_USER', 'jsbin_user');  // Your MySQL username
define('DB_PASSWORD', 'jsbin_password'); // ...and password
define('DB_HOST', 'localhost');  // 99% chance you won't need to change this value

// change this to suite your offline detection
define('OFFLINE', is_dir('/Users/'));

define('MAJOR', 2);
define('MINOR', 0);
define('TINY', 0);

// wishing PHP were more like JavaScript...wishing I was able to use Node.js they way I had wanted...
define('VERSION', OFFLINE ? 'debug' : join(array(MAJOR, MINOR, TINY), '.'));
?>