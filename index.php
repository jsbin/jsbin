<!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8 />
<title>JS Bin - Collaborative JavaScript Debugging</title>
<link rel="stylesheet" href="/css/style.css" type="text/css" />
</head>
<body class="source">
<div id="control">
  <div class="control">
    <div class="buttons">
      <a class="button source" accesskey="1" href="#source">Code</a>
      <a class="button preview" accesskey="2" href="#preview">Preview</a>
    </div>
    <a href="http://jsbin.com/ebabu">http://jsbin.com/ebabu</a>
    <p><a class="light" id="revert" href="#">Revert</a> &mdash; <a class="light" href="#">New revision</a></p>
  </div>
  <div class="starting">
    <a id="startingpoint" class="light" href="#">Use this code as<br /> my starting point</a>
  </div>
  <div class="help">
    <ul class="flat">
      <li><a href="#">About</a></li>
      <li><a href="#">Ajax Debugging</a></li>
      <li><a href="#">Help</a></li>      
    </ul>
  </div>
</div>
<div id="bin" class="stretch">
  <div id="source" class="binview stretch">
    <div class="code stretch javascript">
      <div class="label">JavaScript</div>
      <textarea id="javascript"></textarea>
    </div>
    <div class="code stretch html">
      <div class="label">
        <p>HTML</p>
        <label for="library">Include</label>
        <select id="library">
          <option value="">None</option>
          <option value="jquery">jQuery</option>
          <option value="jquery+jqueryui">jQuery UI</option>
          <option value="yui">YUI</option>
          <option value="protoype">Prototype</option>
          <option value="protoype+scriptalicious">Prototype + Scriptalicious</option>
          <option value="mootools">Mootools</option>
        </select>
      </div>
      <textarea id="html"></textarea>
    </div>
  </div>
  <div id="preview" class="binview stretch">
    <iframe class="stretch"></iframe>
  </div>
</div>
<script src="js/vendor/codemirror/codemirror.js" type="text/javascript"></script>
<script src="js/vendor/json2.js" type="text/javascript"></script>
<script src="js/vendor/jquery-1.3.2.min.js"></script>
<script src="/js/storage.js"></script>
<script src="/js/editors.js"></script>
<script src="/js/app.js"></script>
</body>
</html>















