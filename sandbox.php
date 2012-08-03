<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
<title>JS Bin - <?=$code_id ? $code_id : 'Collaborative JavaScript Debugging'?></title>
<link rel="stylesheet" href="/sandbox.css" type="text/css" media="screen" charset="utf-8" />
<!--[if lte IE 7]>
  <link rel="stylesheet" href="/ie.css" type="text/css" media="screen" charset="utf-8" />
<![endif]-->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js" type="text/javascript"></script>
</head>
<?php
if (@$_COOKIE['light']) {
  echo "<body class=\"light\">\n";
} else {
  echo "<body>\n";
}
?>
<div id="intro">
    <div class="lightbox">
        <div>
            <h1>Collaborative JavaScript Debugging</h1>
            <ol>
                <li>Test live JavaScript with HTML and CSS context</li>
                <li>Public URLs render outside of JS Bin</li>
                <li>Inject major JavaScript libraries</li>
                <li>Debug remote Ajax calls</li>
            </ol>
            
            <p>Screencasts: <a href="/about.html#video">Introduction</a> - <a href="/about.html#ajax">Ajax debugging</a></p>
            
            <small>You should only see this welcome screen once. For more information, see the <a href="/about.html">about</a> pages.</small>
        </div>
    </div>
</div>
<!--<div id="options">
    <div>
        <form action="">
            <input type="button" value="Never Expire" />
            <input type="button" value="Close" id="closeOptions" />
        </form>
    </div>
</div>-->
<form action="/save" method="post" id="saveCode">
<?php if (@$streaming_key) : ?>
<input type="hidden" id="streamingKey" name="streaming_key" value="<?=$streaming_key?>" />
<?php endif ?>
<?php if (@$streaming) : ?>
<input type="hidden" id="streaming" name="streaming" value="<?=$streaming_read_key?>" />
<?php endif ?>
<div id="headerWrapper">
<div id="header">
    <ul>
        <li>
            <label for="library">Include: </label>
<?php
if (!isset($library)) {
    $library = '';
}
$selected = array(
    'jquery' => ('jquery' == $library),
    'prototype' => ('prototype' == $library),
    'yui' => ('yui' == $library),
    'mootools' => ('mootools' == $library),
    'dojo' => ('dojo' == $library),
    'ext' => ('ext' == $library)
);
?>
            <select name="library" id="library">
                <option value="none">None</option>
                <option <?=@$selected['jquery']?'selected="selected" ':''?>value="jquery">jQuery</option>
                <option value="jqueryui+jquery">jQuery UI</option>
                <option <?=@$selected['prototype']?'selected="selected" ':''?>value="prototype">prototype</option>
                <option value="scriptaculous+prototype">script.aculo.us</option>
                <option <?=@$selected['yui']?'selected="selected" ':''?>value="yui">YUI</option>
                <option <?=@$selected['mootools']?'selected="selected" ':''?>value="mootools">MooTools</option>
                <option <?=@$selected['dojo']?'selected="selected" ':''?>value="dojo">dojo</option>
                <option <?=@$selected['ext']?'selected="selected" ':''?>value="ext">Ext JS</option>
            </select>
        </li>
        <li><input type="button" class="reset" value="Reset code" /></li>
        <li><input type="submit" class="save" value="Save to public URL" /></li>
<?php if ($code_id) : ?>
        <li><a id="codeId" href="/<?=$code_id?>">http://jsbin.com/<?=$code_id?></a><span></span></li>
<?php endif ?>
<!--        <li><a id="ffbanner" href="http://full-frontal.org"><img src="/jsbin-ff.gif" alt="JavaScript Conference - 20th November"/></a></li> -->
        <li class="right"><a href="http://full-frontal.org">Check out my JavaScript conference</a> <a href="/about.html">About &amp; Help</a></li>
    </ul>
</div>
<ul id="navigation">
    <li><a accesskey="1" class="selected" href="#javascript">JavaScript</a></li>
    <li><a accesskey="2" href="#html">HTML</a></li>
    <li><a accesskey="3" href="#output" title="Click to run output again">Output</a></li>
</ul>
</div>
<div id="wrapper">
    <div id="body">
        <div id="javascript" class="panel">
            <textarea wrap="off" name="javascript"></textarea>
            <pre><span class="help">Double click to edit</span><code class="javascript"></code></pre>
        </div>
        <div id="html" class="panel">
            <textarea wrap="off" name="html"></textarea>
            <pre><span class="help">Double click to edit</span><code class="html"></code></pre>
        </div>
        <div id="output" class="panel">
            <iframe border="0" frameborder="0" src="/blank.html"></iframe>
        </div>
    </div>
</div>
</form>
<p id="footer"> JS Bin built by <a href="http://remysharp.com/">Remy Sharp</a> / <a href="http://twitter.com/rem">@rem</a></p>

<?php if (@$streaming) : ?>
<script type="text/javascript" src="/jquery.comet.js"></script>
<!-- <script type="text/javascript" src="/dojo/dojo.js"></script> -->
<!-- <script type="text/javascript" src="/dojox/cometd.js"></script> -->
<?php endif ?>
<?php 
$qs = '';
if (isset($_GET['js']) || isset($_GET['html'])) {
    $qs .= '?';
}

if (@$_GET['js']) {
    $qs .= 'js=' . rawurlencode($_GET['js']);
    
    if (@$_GET['html']) {
        $qs .= '&amp;';
    }
}

if (@$_GET['html']) {
    $qs .= 'html=' . rawurlencode($_GET['html']);
}

?>
<script src="<?=$code_id ? '/' . $code_id : '' ?>/source/<?=$qs?>" type="text/javascript"></script>
<script src="/sandbox.min.js" type="text/javascript"></script>
<script src="/sandbox.js" type="text/javascript"></script>
<?php if (@$library && $library != 'jquery') : ?>
<script type="text/javascript">
$(function () {
    $('#library').val('<?=$library?>').change();
});
</script>
<?php endif ?>
<?php if (true) : ?>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
var pageTracker = _gat._getTracker("UA-1656750-13");
pageTracker._trackPageview();
</script>
<?php endif ?>
</body>
</html>
