<?php
/**
 * PHPSprocket - A PHP implementation of Sprocket
 *
 * @package sprocket
 * @subpackage libs
 */
require_once('sprocket_command.php');

// CSS Minify 
define('MINIFY_CSS', 'cssmin-v1.0.1.b3.php');
// JS Minify
define('MINIFY_JS', 'jsmin-1.1.1.php');

/**
 * Sprocket Class
 * 
 * @author Kjell Bublitz
 * @author Stuart Loxton
 */
class Sprocket
{	
	/**
	 * Constructor
	 *
	 * @param string $file Javascript file to use
	 * @param array $options Sprocket settings
	 */
	function __construct($file, $options = array()) {
		
		$options = array_merge(array(
			'baseUri' => '/php-sprockets',
			'baseFolder' => '/js',
			'assetFolder' => '..',
			'debugMode' => false,
			'autoRender' => false,
			'contentType' => 'application/x-javascript',
		), $options); 
		
		extract($options, EXTR_OVERWRITE);
		
		$this->setBaseUri($baseUri);
		$this->setBaseFolder($baseFolder);
		$this->setAssetFolder($assetFolder);
		$this->setDebugMode($debugMode);
		$this->setContentType($contentType);

		$this->setFilePath($file);
				
		if ($autoRender) $this->render();
	}
	
	/**
	 * Return rendered version of current js file.
	 * @return string
	 */
	function render($return = false) {
		if (!$this->debugMode) {
			if ($this->isCached()) {
				$this->_parsedSource = $this->readCache();
				$this->_fromCache = true;
			}
		}
		
		if (!$this->_fromCache) {	
			$file = basename($this->filePath);
			$context = dirname($this->filePath);
			
			$this->_parsedSource = $this->parseFile($file, $context);
		}
		
		if (!$this->debugMode && !$this->_fromCache) {
			file_put_contents($this->filePath.'.cache', $this->_parsedSource);
		}
		
		if ($this->contentType) {
			header ("Content-Type: {$this->contentType}");
		}
		
		if ($return) {
			return $this->_parsedSource;
		}
		
		echo $this->_parsedSource;
	}
	
	/**
	 * Parse JS File
	 * 
	 * - read and replace constants
	 * - parse and execute commands
	 * - stript comments
	 *
	 * @param string $file Filepath
	 * @param string $context Directory
	 * @return string Sprocketized Source
	 */
	function parseFile($file, $context) {		
		if (!is_file(realpath($this->filePath))) 
			$this->fileNotFound();				
		
    if (!$this->requiresProcessing(realpath($context.'/'.$file))) return;

		$source = file_get_contents($context.'/'.$file);
				
		// Parse Commands
		preg_match_all('/\/\/= ([a-z]+) ([^\n]+)/', $source, $matches);
		foreach($matches[0] as $key => $match) {
			$commandRaw = $matches[0][$key];
			$commandName = $matches[1][$key];
			
			if ($this->commandExists($commandName)) {
				$param = trim($matches[2][$key]);			
				$command = $this->requireCommand($commandName);
				$commandResult = $command->exec($param, $context);
				if (is_string($commandResult)) {
					$source = str_replace($commandRaw, $commandResult, $source);
				}
			}
		}
		
		// Parse Constants
		$constFile = $context.'/'.str_replace(basename($file), '', $file). 'constants.ini';
		if (is_file($constFile)) {
			if(!isset($this->_constantsScanned[$constFile])) {
				$this->parseConstants($constFile);
			}
			if (count($this->_constants)) {
				$source = $this->replaceConstants($source);				
			}
		}		
		
		// this doesn't work properly, because it could strip two slashes inside a string, which would be wrong
    // $this->stripComments();
		
		return $source;
	}	
	
	/**
	 * Parse constants.ini. 
	 * 
	 * Compared to original Sprockets i don't use YML. 
	 * Why make things complicated?
	 * 
	 * @param string $file Path to INI File
	 */
	function parseConstants($file) {
		$this->_constants = parse_ini_file($file);		
		$this->_constantsScanned[$file] = true;
	}
	
	/**
	 * Replace Constant Tags in Source with values from constants file
	 *
	 * @param string $source 
	 * @return string
	 */
	function replaceConstants($source) {
		preg_match_all('/\<(\%|\?)\=\s*([^\s|\%|\?]+)\s*(\?|\%)\>/', $source, $matches);
		
		foreach($matches[0] as $key => $replace) {
			$source = str_replace($replace, $this->_constants[$matches[2][$key]], $source);
		}
		return $source;
	}
	
	/**
	 * Remove obsolete comments
	 */
	function stripComments() {
		$this->_parsedSource = preg_replace('/\/\/([^\n]+)/', '', $this->_parsedSource);
	}	
	
	/**
	 * Check if a class file exists for the command requested
	 * 
	 * @param string $command Name of the command (example: 'require')
	 * @return boolean
	 */
	function commandExists($command) {
		return is_file(dirname(__FILE__).'/commands/'.$command.'.php');
	}
	
	/**
	 * Require and instantiate the command class.
	 *
	 * @param string $command Name of the command (example: 'require')
	 * @return object
	 */
	function requireCommand($command) {
		require_once(dirname(__FILE__).'/commands/'.$command.'.php');
		$commandClass = 'SprocketCommand'.ucfirst($command);
		$commandObject = new $commandClass($this);
		return $commandObject;
	}
	
	/**
	 * Check if a cached version exists
	 * 
	 * @return boolean
	 */
	function isCached() {
		return is_file($this->filePath.'.cache');
	}
	
	/**
	 * Read the cached version from filesystem
	 * 
	 * @return string
	 */
	function readCache() {
		return file_get_contents($this->filePath.'.cache');
	}
	
	/**
	 * Write current parsedSource to filesystem (.cache file)
	 * 
	 * @return boolean
	 */
	function writeCache() {
		return file_put_contents($this->filePath.'.cache', $this->_parsedSource);
	}
	
	/**
	 * File Not Found - Sends a 404 Header if the file does not exist.
	 * Just overwrite this if you want to do something else. 
	 */ 
	function fileNotFound() {
		header("HTTP/1.0 404 Not Found"); 
		echo '<h1>404 - File Not Found</h1>';
		exit;
	}
	
	/**
	 * Assign the current file to parse. 
	 *
	 * @param string $filePath Full Path to the JS file
	 * @return object self
	 */
	function setFilePath($filePath) {
		$this->filePath = str_replace($this->baseUri, '..', $filePath);
		$this->fileExt = array_pop(explode('.', $this->filePath));
		return $this;
	}
	
	/**
	 * Enable or Disable the debug mode. 
	 * Debug mode prevents file caching.
	 *
	 * @param boolean $enabled
	 * @return object self
	 */
	function setDebugMode($enabled = true) {
		$this->debugMode = $enabled;
		return $this;		
	}
	
	/**
	 * Set assetFolder
	 *
	 * @param string $assetFolder
	 * @return object self
	 */
	function setAssetFolder($assetFolder) {
		$this->assetFolder = $assetFolder;
		return $this;		
	}
	
	/**
	 * Set baseFolder
	 *
	 * @param string $baseFolder
	 * @return object self
	 */
	function setBaseFolder($baseFolder) {
		$this->baseFolder = $baseFolder;
		return $this;		
	}
	
	/**
	 * Set baseUri
	 *
	 * @param string $baseUri
	 * @return object self
	 */
	function setBaseUri($baseUri) {
		$this->baseUri = $baseUri;
		return $this;		
	}
	
	/**
	 * Set contentType
	 *
	 * @param string $baseUri
	 * @return object self
	 */
	function setContentType($contentType) {
		$this->contentType = $contentType;
		return $this;
	}
	
	function requiresProcessing($file) {
	  $processed = true;
	  if (in_array($file, $this->_processed) != 1) {
	    $this->_processed[] = $file;
	  } else {
	    $processed = false;
	  }
	  
	  return $processed;
	}
	
	/**
	 * Base URI - Path to webroot
	 * @var string
	 */
	var $baseUri = '';
	
	/**
	 * Base JS - Relative location of the javascript folder
	 * @var string
	 */
	var $baseFolder = '';
	
	/**
	 * File Path - Current file to parse
	 * @var string
	 */
	var $filePath = '';
	
	/**
	 * File Extension
	 * @var string
	 */
	var $fileExt = 'js';
	
	/**
	 * Assets - Relative location of the assets folder
	 * @var string
	 */
	var $assetFolder = '';
	
	/**
	 * Debug Option
	 * @var boolean
	 */ 
	var $debugMode = false;	
	
	/**
	 * Source Content Type
	 * @var string
	 */
	var $contentType = 'application/x-javascript';
	
	/**
	 * JS Source - Current Source 
	 * @var string
	 * @access private
	 */
	var $_parsedSource = '';
	
	/**
	 * Scanned Const files
	 * @var array
	 * @access private
	 */
	var $_constantsScanned = array();
	
	/**
	 * Constants keys and values
	 * @var array
	 * @access private
	 */
	var $_constants = array();
	
	/**
	 * Source comes from cache
	 * @var boolean
	 * @access private
	 */
	var $_fromCache = false;	
	
	/**
	 * Keep track of loaded JS script to avoid loading more than once
	 * @var array
	 * @access private
	 */
	var $_processed = array();
	
}
?>