<!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8 />
<title>JS Bin - Collaborative JavaScript Debugging</title>
<style>
body { 
  margin: 0; 
  padding: 0;
  font-family: "Helvetica Neue";
  font-size: 13px;
  min-width: 976px;
  overflow: hidden;
  background: url(/images/jsbin-bg.png) repeat-x 0 -3px;
}

p {
  margin: 0;
}

#control {
  height: 63px;
  position: relative;
  width: 100%;
}

.control, .help, .starting {
  width: 100px;
  padding: 15px;
  float: left;
}

.control, .starting {
  width: 30%;
}

.starting {
  text-align: center;
}

.help {
  width: 300px;
  text-align: right;
  float: right;
}

ul.flat {
  margin: 0;
  padding: 0;
}

ul.flat li {
  float: left;
  display: block;
  list-style: none;
  margin: 0 0 0 15px;
  padding: 0;
}

.help ul.flat {
  float: right;
}

#control > *, a {
  color: #232323;
  text-shadow: #fff 1px 1px 1px;
}

a {
  font-weight: bold;
}

a:hover {
  text-shadow: #fff -1px -1px 3px;
}

.light {
  font-weight: normal;
  text-decoration: none;
}

.stretch {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#bin {
  top: 64px;
  width: 100%;
}

div.html {
  left: 50%;
}

/*.mozilla #bin div.html {
  margin-left: -2px;
}

.mozilla #bin.javascript div.javascript,
.mozilla #bin div.html {
  border: 1px solid #0080FF;
}

#bin.javascript div.html,
#bin div.javascript {
  border: 0;
}
*/
div.code {
  width: 50%;
}

div.preview {
  display: none;
  width: 100%;
}

.code p {
  font-weight: bold;
  background: #fff;
  padding: 10px;
  padding-right: 0;
  margin-left: 1px;
}

iframe.javascript {
  border-right: 1px solid #ccc !important;
}

.buttons {
  float: left;
  display: block;
  margin-right: 10px;
}

body.preview #source,
body.source #preview {
  display: none;
}

body.preview #preview,
body.source #source {
  display: block;
}

a.button {
  border: 1px solid #ccc;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  height: 12px;
  line-height: 12px;
  padding: 10px;
  display: block;
  float: left;
  text-decoration: none;
  margin: 0px 5px;
  background: #fff;
  background: rgba(255, 255, 255, 0.3);
}

body.source a.source,
body.preview a.preview {
  background: #000;
  background: rgba(0, 0, 0, 0.25);
  text-shadow: none;
  border: 1px solid #ccc;
  -moz-box-shadow: #fff 0px 0px 5px;
  -webkit-box-shadow: #fff 0px 0px 5px;
}
</style>
</head>
<body class="source">
<div id="control">
  <div class="control">
    <div class="buttons">
      <a class="button source" href="#source">Code</a>
      <a class="button preview" href="#preview">Preview</a>
    </div>
    <a href="http://jsbin.com/ebabu">http://jsbin.com/ebabu</a>
    <p><a class="light" id="revert" href="#">Revert</a> &mdash; <a class="light" href="#">New milestone</a></p>
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
      <textarea id="javascript"></textarea>
    </div>
    <div class="code stretch html">
      <textarea id="html"></textarea>
    </div>
  </div>
  <div id="preview" class="binview stretch">
    
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















