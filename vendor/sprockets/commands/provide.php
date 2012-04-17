<?php
/**
 * PHPSprocket - A PHP implementation of Sprocket
 *
 * @package sprocket
 * @subpackage commands
 */

/**
 * SprocketCommand : Provide Class
 * 
 */
class SprocketCommandProvide extends SprocketCommand 
{
	/**
	 * Command Exec
	 */	
	function exec($param, $context) {
		preg_match('/\"([^\"]+)\"/', $param, $match);
		foreach(glob($context.'/'.$match[1].'/*') as $asset) {
			shell_exec('cp -r '.realpath($asset).' '.realpath($this->Sprocket->assetFolder));
		}
	}
}