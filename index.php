<?php 

define('MAJOR', 2);
define('MINOR', 4);
define('TINY', 7);

include('app.php'); 
if ($revision != 1 && $revision) {
  $code_id .= '/' . $revision;
}
$code_id_path = '';
if ($code_id) {
  $code_id_path = '/' . $code_id;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8 />
<title>JS Bin - Collaborative JavaScript Debugging</title>
<link rel="stylesheet" href="/css/style.css?<?=VERSION?>" type="text/css" />
</head>
<!--[if lt IE 7 ]><body class="source ie6"><![endif]--> 
<!--[if !IE]><!--><body class="source"><!--<![endif]-->  
<div id="control">
  <div class="control">
    <div class="buttons">
      <a class="tab button source group left" accesskey="1" href="#source">Code</a>
      <a class="tab button preview group right gap" accesskey="2" href="#preview">Preview</a>
      <a title="Revert" class="button light group left enable" id="revert" href="#"><img class="enabled" src="/images/revert.png" /><img class="disabled" src="/images/revert-disabled.png" /></a>
    <?php if ($code_id) : ?>
    <a class="button group light left" href="<?=HOST . $code_id?>"><?=HOST . $code_id?></a>
    <?php else : ?>
    <a id="save" class="button save group left right gap" href="/save">Save</a>
    <?php endif ?>
    <?php if ($code_id) : ?><a id="save" class="button gap light save group right" href="<?=$code_id_path?>/save">Save changes</a><?php endif ?>
    <a id="stream" class="button left right" href="#stream">Stream</a>
    </div>
  </div>
  <!-- <div class="starting">
    
  </div> -->
  <div class="help">
    <ul class="flat">
      <li><a id="startingpoint" href="#"><span>Save as my template</span></a></li>
      <!-- <li><a class="video" href="/about">About</a></li>
      <li><a class="video" href="#">Ajax Debugging</a></li> -->
      <li><a href="/help">Help &amp; tutorials</a></li>
    </ul>
  </div>
</div>
<div id="bin" class="stretch">
  <div id="source" class="binview stretch">
    <div class="code stretch javascript">
      <div class="label"><p><strong id="jslabel">JavaScript</strong><span> (<span class="hide">hide</span><span class="show">show</span> HTML)</span></p></div>
      <textarea id="javascript"></textarea>
    </div>
    <div class="code stretch html">
      <div class="label">
        <p>HTML<span>  (<span class="hide">hide</span><span class="show">show</span> JavaScript)</span></p>
        <label for="library">Include</label>
        <select id="library">
          <option value="none">None</option>
          <option value="jquery">jQuery</option>
          <option value="jquery+jqueryui">jQuery UI</option>
          <option value="yui">YUI</option>
          <option value="prototype">Prototype</option>
          <option value="prototype+scriptaculous">Scriptaculous</option>
          <option value="mootools">Mootools</option>
          <option value="dojo">Dojo</option>
          <option value="ext">Ext js</option>
        </select>
      </div>
      <textarea id="html"></textarea>
    </div>
  </div>
  <div id="live" class="stretch livepreview"><span class="close"></span></div>
  <div id="preview" class="binview stretch"></div>
  <form method="post" action="<?=$code_id_path?>/save"></form>
</div>
<div id="help"><p><a href="/help/index.html">Help Menu</a></p><div id="content"></div></div>
<?php 
// construct the correct query string, if we're injecting the html or JS
$qs = '';
if (isset($_GET['js']) || isset($_GET['html']) || (@$_POST['inject'] && isset($_POST['html'])) ) {
  $qs .= '?';
}

if (@$_GET['js']) {
  $qs .= 'js=' . rawurlencode(stripslashes($_GET['js']));
  
  if (@$_GET['html']) {
    $qs .= '&amp;';
  }
}

if (@$_GET['html']) {
  $qs .= 'html=' . rawurlencode(stripslashes($_GET['html']));
}

if (@$_POST['inject'] && @$_POST['html']) :
  $jsonReplaces = array(array("\\", "/", "\n", "\t", "\r", "\b", "\f", '"'), array('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"'));
  $html = '"' . str_replace($jsonReplaces[0], $jsonReplaces[1], $_POST['html']) . '"';
?>
<script>var template = { html : <?=$html?>, javascript: '' };</script>
<?php else : ?>
<script src="<?=$code_id_path ?>/source/<?=$qs?>"></script>  
<?php endif ?>
<script src="http://forbind.net/js/?apikey=2796bc83070164231a3ab8c90227dbca"></script>
<script src="/js/<?=VERSION?>/jsbin.js"></script>
<?php if (!OFFLINE) : ?>
<script>
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-1656750-13']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
})();
</script>
<?php endif ?>
</body>
</html>