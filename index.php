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

#bin.javascript div.javascript,
#bin div.html {
/*  opacity: 1;
  -moz-opacity: 1;
  filter:alpha(opacity=1);
*/}

#bin.javascript div.html,
#bin div.javascript {
/*  opacity: 0.7;
  -moz-opacity: 0.7;
  filter:alpha(opacity=70);
*/}

.html {
  left: 50%;
}

.code {
  width: 50%;
}

.preview {
  display: none;
  width: 100%;
}

.codeframe {
/*  top: 40px;*/
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
</style>
</head>
<body>
<div id="control">
  <div class="control">
    <a href="http://jsbin.com/ebabu">http://jsbin.com/ebabu</a>
    <p><a class="light" href="#">Revert</a> &mdash; <a class="light" href="#">New milestone</a></p>
  </div>
  <div class="starting">
    <a class="light" href="#">Use this code as<br /> my starting point</a>
  </div>
  <div class="help">
    <ul class="flat">
      <li><a href="#">About</a></li>
      <li><a href="#">Ajax Debugging</a></li>
      <li><a href="#">Help</a></li>      
    </ul>
  </div>
</div>
<div id="bin" class="stretch javascript">
  <div class="source binview stretch">
    <div class="code stretch javascript">
      <textarea id="javascript">if (document.getElementById('hello')) {
  document.getElementById('hello').innerHTML = 'Hello World - this was inserted using JavaScript';
}</textarea>
    </div>
    <div class="code stretch html">
      <textarea id="html">&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
  &lt;meta charset=utf-8 /&gt;
  &lt;title&gt;JS Bin Sandbox&lt;/title&gt;
  &lt;style&gt;
    body { font: 13px Helvetica, Arial; }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;p&gt;Hello from JS Bin&lt;/p&gt;
  &lt;p id=&quot;hello&quot;&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</textarea>
    </div>
  </div>
  <div class="preview binview stretch">
    
  </div>
</div>
<script src="js/vendor/codemirror/codemirror.js" type="text/javascript"></script>
<script src="/js/vendor/json2.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="/js/storage.js"></script>
<script src="/js/editors.js"></script>
</body>
</html>















