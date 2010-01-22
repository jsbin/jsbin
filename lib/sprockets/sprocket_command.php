<?php
/**
 * PHPSprocket - A PHP implementation of Sprocket
 *
 * @package sprocket
 * @subpackage libs
 */

/**
 * SprocketCommand Class
 * 
 * @author Kjell Bublitz
 */
class SprocketCommand {

	/**
	 * Sprocket Object
	 * @var object
	 */
	var $Sprocket;
	
	/**
	 * Command Constructor
	 */
	function __construct(&$sprocket) {
		$this->Sprocket = $sprocket;
	}
	
	/**
	 * Return filename
	 */
	function getFileName($context, $param) {
		return basename($context.'/'.$param.'.'.$this->Sprocket->fileExt);
	}
	
	/**
	 * Return filecontext
	 */
	function getFileContext($context, $param) {
		return dirname(realpath($context.'/'.$param.'.'.$this->Sprocket->fileExt));
	}
}
?>