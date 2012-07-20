<?php

// Parse the package.json file to get the version.
$package = json_decode(file_get_contents('package.json'));
define('VERSION', $package->version);
define('SPROCKETIZED', './public/js/tmp.' . VERSION . '.js');
define('PRODUCTION', './public/js/jsbin-' . VERSION . '.js');

// sprocketize the code in to jsbin.VERSION.js
require_once('vendor/sprockets/sprocket.php');

echo "Sprocketizing...\n";

$filePath = './public/js/jsbin.js';
// prepare sprocket
$sprocket = new Sprocket($filePath, array(    
  'contentType' => '', // keeps debug quiet
  'baseUri' => '../public/js',
  'baseFolder' => array('./public/js/vendor', './public/js/vendor/codemirror2'),
  'assetFolder' => '..',
  'debugMode' => true, // forces to always show
  'autoRender' => false
));

// concat complete
echo "Rendering...\n";
$js = $sprocket->render(true);

// write concat to js dir
echo "Writing concatenated file...\n";
file_put_contents(SPROCKETIZED, $js);

// google compile in to jsbin.VERSION.js
echo "Google compiler compressing...\n";
system('java -jar "./vendor/compiler.jar" --js="' . SPROCKETIZED . '" --js_output_file="' . PRODUCTION . '" --warning_level=QUIET');

unlink(SPROCKETIZED);
echo "Compressed: " . PRODUCTION . "\nFile size: " . filesize(PRODUCTION) . " bytes.\n";
?>
