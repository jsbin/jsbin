<?php
/**
 * PHPSprocket - A PHP implementation of Sprocket
 *
 * @package sprocket
 * @subpackage commands
 */

/**
 * SprocketCommand : Require Class
 * 
 */
class SprocketCommandRequire extends SprocketCommand 
{	
	/**
	 * Command Exec
	 * @return string Parse file
	 */
	function exec($param, $context) 
	{
		$source = '';
		
		// parse require params
		if (preg_match('/\"([^\"]+)\" ([^\n]+)|\"([^\"]+)\"/', $param, $match)) // "param"
		{	
			if (count($match) == 3) {
				$paramArg = $match[1];
				$optionArg = $match[2];
			}
			if (count($match) == 4) {
				$paramArg = $match[3];
			}			
			
			$fileName = $this->getFileName($context, $paramArg);
			$fileContext = $this->getFileContext($context, $paramArg);
			$source = $this->Sprocket->parseFile($fileName, $fileContext);
			
			// apply file options
			if (!empty($source) && isset($optionArg)) {
				$fileOptions = array_map('trim', explode(',', $optionArg));
				foreach ($fileOptions as $option) {
					$optionMethod = 'option'.ucfirst($option);
					$source = $this->{$optionMethod}($source, $fileContext, $fileName);
				}
			}
		} 
		else if(preg_match('/\<([^\>]+)\>/', $param, $match)) // <param>
		{
			$fileName = $this->getFileName($context, $match[1]);
			
			if (is_array($this->Sprocket->baseFolder)) {
			  foreach ($this->Sprocket->baseFolder as $folder) {
			    $fileContext = $folder;
			    if (!is_file(realpath($fileContext . '/' . $fileName))) {
			      continue;
			    }
    			$source = $this->Sprocket->parseFile($fileName, $fileContext);
  			  if ($source) break;
			  }			  
			} else {
			  $fileContext = $this->Sprocket->baseFolder;
  			$source = $this->Sprocket->parseFile($fileName, $fileContext);
			}			
		}
		
		return $source;
	}
	
	/**
	 * Apply minification if possible
	 * 
	 * @param string $source
	 * @return string
	 */
	function optionMinify($source, $context = null, $filename = null) 
	{
		if ($this->Sprocket->fileExt == 'css') {
			if (!class_exists('cssmin')) {
				require_once(realpath(dirname(__FILE__).'/../third-party/'.MINIFY_CSS));
			}
			$source = cssmin::minify($source, "preserve-urls");	
		}
		
		if ($this->Sprocket->fileExt == 'js') {
			if (!class_exists('JSMin')) {
				require_once(realpath(dirname(__FILE__).'/../third-party/'.MINIFY_JS));
			}
			$source = JSMin::minify($source);	
		}

		return $source;
	}
}