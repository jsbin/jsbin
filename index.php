<?php include('app.php'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8 />
<title>JS Bin - Collaborative JavaScript Debugging</title>
<link rel="stylesheet" href="/css/style.css" type="text/css" />
</head>
<body class="source">
<div id="intro">
  <div class="lightbox">
    <div>
      <h1>Collaborative JavaScript Debugging</h1>
      <ol class="intro">
        <li>Test live JavaScript with HTML and CSS context</li>
        <li>Public URLs render outside of JS Bin</li>
        <li>Inject major JavaScript libraries</li>
        <li>Debug remote Ajax calls</li>
      </ol>
      
      <ul class="keyboardShortcuts">
        <li><strong>Keyboard Shortcuts:</strong></li>
        <li><code>ctrl + 1</code> View source</li>
        <li><code>ctrl + 2</code> View preview</li>
        <li><code>ctrl + &larr;</code> Focus JavaScript</li>
        <li><code>ctrl + &rarr;</code> Focus HTML</li>
      </ul>

      <p class="screencasts">Screencasts: <a href="/about#video">About</a> - <a href="/about#ajax">Ajax debugging</a></p>
    </div>
  </div>
</div>
<div id="control">
  <div class="control">
    <div class="buttons">
      <a class="button source" accesskey="1" href="#source">Code</a>
      <a class="button preview" accesskey="2" href="#preview">Preview</a>
    </div>
    <?php if ($code_id) : ?>
    <a href="http://jsbin.com/<?=$code_id?>">http://jsbin.com/<?=$code_id?></a>
    <?php else : ?>
    <a id="save" class="save" href="/save">Create public link</a>
    <?php endif ?>
    <p><a class="light" id="revert" href="#">Revert</a><?php if ($code_id) : ?><span id="revision"> &mdash; <a id="newRevision" class="light save" href="/save">New revision</a></span><?php endif ?></p>
  </div>
  <div class="starting">
    <a id="startingpoint" class="light" href="#"><span>Use as my template</span></a>
  </div>
  <div class="help">
    <ul class="flat">
      <li><a class="video" href="/about">About</a></li>
      <li><a class="video" href="#">Ajax Debugging</a></li>
      <li><a href="/faq">Help</a></li>      
    </ul>
  </div>
</div>
<div id="bin" class="stretch">
  <div id="source" class="binview stretch">
    <div class="code stretch javascript">
      <div class="label"><p>JavaScript<span>&larr;</span></p></div>
      <textarea id="javascript"></textarea>
    </div>
    <div class="code stretch html">
      <div class="label">
        <p>HTML<span>&rarr;</span></p>
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
  <div id="preview" class="binview stretch">
    <iframe class="stretch"></iframe>
  </div>
  <form method="post" action="/save"></form>
</div>
<?php 
// construct the correct query string, if we're injecting the html or JS
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
<script src="<?=$code_id ? '/' . $code_id : '' ?>/source/<?=$qs?>"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js"></script>
<script src="/js/<?=VERSION?>/jsbin.js"></script>
</body>
</html>