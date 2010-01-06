<?php 
require_once('config.php');
require_once('lib/sprockets/sprocket.php');
 
// get path from request
$filePath = preg_replace('/\?.*/', '', $_SERVER['REQUEST_URI']);
 
// prepare sprocket
$sprocket = new Sprocket($filePath, array(    
	'contentType' => 'application/x-javascript',
	'baseUri' => '../js',
  'baseFolder' => '/js',
  'assetFolder' => '..',
	'debugMode' => OFFLINE ? true : false,
  'autoRender' => false
));
 
// change base folder based on extension
switch ($sprocket->fileExt) 
{
	case 'css':
		$sprocket->setContentType('text/css')->setBaseFolder('/css');
		break;
 
	default: case 'js':
		$sprocket->setBaseFolder(array('./js/vendor', './js/vendor/codemirror'));
		break;
}

// having to hack the source path to get it work properly.
$sprocket->filePath = '.' . str_replace(VERSION . '/', '', $sprocket->filePath);

// tada!
$sprocket->render();
?>