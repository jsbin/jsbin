<?php 

include('app.php'); 

list($code_id, $revision) = getCodeIdParams($request);

$edit_mode = false;

if ($code_id) {
  list($latest_revision, $html, $javascript, $css) = getCode($code_id, $revision, true);
} else {
  list($latest_revision, $html, $javascript, $css) = defaultCode();
} 

if ($revision != 1 && $revision) {
  $code_id .= '/' . $revision;
}
$code_id_path = ROOT;
if ($code_id) {
  $code_id_path = ROOT . $code_id . '/';
}

?>
<!DOCTYPE html>
<html id="jsbin" lang="en">
<head>
<meta charset=utf-8 />
<title>JS Bin - Collaborative JavaScript Debugging</title>
<link rel="stylesheet" href="<?php echo ROOT?>css/style.css?<?php echo VERSION?>" type="text/css" />
</head>
<!--[if lt IE 7 ]><body class="source ie ie6"><![endif]--> 
<!--[if lt IE 8 ]><body class="source ie ie7"><![endif]--> 
<!--[if gte IE 8 ]><body class="source ie"><![endif]--> 
<!--[if !IE]><!--><body class="source"><!--<![endif]-->
<div id="control">
  <div class="control">
    <div class="buttons">
      <div class="menu">
        <div class="group">
          <a href="<?php echo ROOT?>save" class="save title button">Save</a><a href="#savemenu" class="button button-dropdown"><span class="icon icon-chevron-down"></span></a>
        </div>
        <div class="dropdown" id="savemenu">
          <div class="dropdownmenu">
<?php if ($code_id) : ?>
            <a id="clone" title="Create a new copy" class="button clone group" href="<?php echo ROOT?>clone">Clone</a>
            <a id="save" title="Save new a new revision" class="button save group" href="<?php echo $code_id_path?>save">Save</a>
<?php else : ?>
            <a id="save" title="Save new bin" class="button save group" href="<?php echo ROOT?>save">Save</a>
<?php endif ?>
            <a id="download" title="Save to drive" class="button download group icon icon-download-alt" href="<?php echo ROOT?>download">Download</a>
            <a id="startingpoint" title="Set as starting code" class="button group" href="<?php echo ROOT?>save">As template</a>
          </div>
        </div>
      </div>

      <div id="panels"></div>
    </div>
  </div>
  <div class="help">
    <?php if ($code_id) : ?>
    <span class="meta">
      <a title="Revert" class="button light group left" id="revert" href="#"><img class="enabled" src="<?php echo ROOT?>images/revert.png" /><img class="disabled" src="<?php echo ROOT?>images/revert-disabled.png" /></a>
      <a id="jsbinurl" class="button group light left right gap" href="http://<?php echo $_SERVER['HTTP_HOST'] . ROOT . $code_id?>"><?php echo $_SERVER['HTTP_HOST'] . ROOT . $code_id?></a>
    </span>
    <?php endif ?>
    <?php if ($home) : ?>
    <div class="menu">
      <div class="group">
        <a href="#" class="button" id="homebtn"><?php echo $home ?></a><a href="#homemenu" class="button button-dropdown"><span class="icon icon-chevron-down"></span></a>
      </div>
      <div class="dropdown" id="homemenu">
        <div class="dropdownmenu">
          <a id="logout" class="button group" href="<?php echo ROOT . $code_id?>logout">Logout</a>
        </div>
      </div>
    </div>
    <?php else : ?>
    <a href="#" class="button" id="loginbtn">Log in</a>
    <?php endif ?>
    <a href="http://jsbin.tumblr.com" class="button group">Tips</a>
  </div>
</div>
<div id="bin" class="stretch" style="opacity: 0; filter:alpha(opacity=0);">
  <div id="source" class="binview stretch">
    <div class="code stretch javascript panel">
      <div class="label"><strong>JavaScript</strong></div>
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="javascript"></textarea>
      </div>
    </div>
    <div class="code stretch css panel">
      <div class="label"><strong id="csslabel">CSS</strong></div>
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="css"></textarea>
      </div>
    </div>
    <div class="code stretch html panel">
      <div class="label">
        <strong>HTML</strong>
        <label for="library">Include</label>
        <select id="library" class="chosen">
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
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="html"></textarea>
      </div>
    </div>
    <div class="stretch console panel">
      <div class="label"><strong>Console</strong></div>
      <div id="console" class="stretch"><ul id="output"></ul></div>
    </div>
    <div id="live" class="stretch live panel">
      <div class="label">
        <strong>Live Preview</strong>
        <span class="options">
          <button id="runwithalerts">Run JS with alerts</button>
          <label>Include JS<input type="checkbox" id="enablejs"></label>
        </span>
      </div>
    </div>
  </div>
  <form id="saveform" method="post" action="<?php echo $code_id_path?>save">
    <input type="hidden" name="method" />
  </form>
</div>
<div id="tip"><p>You can jump to the latest bin by adding <code>/latest</code> to your URL</p><a class="dismiss" href="#">Dismiss x</a></div>
<div id="login" class="modal">
  <div>
    <h2>Log in / Register</h2>
    <p id="loginFeedback"></p>
    <p>Logging in will associate your account with all bins you create, and allow you to access that complete history.</p>
    <form action="/login" method="post">
      <div>
        <label for="username">Username</label><input id="username" type="text" name="username">
      </div>
      <div>
        <label for="password">Password</label><input id="password" type="password" name="password">
      </div>
      <div>
        <label for="email">Email *</label><input id="email" type="email" name="email">
        <p>Email is not required. It can be used reset your password.</p>
      </div>
      <div>
        <input type="submit" value="Log in">
      </div>
    </form>
  </div>
</div>
<div id="keyboardHelp" class="modal">
  <div>
    <h2>Keyboard Shortcuts</h2>
    <table>
      <thead>
        <tr>
          <th class="shortcut">Shortcut</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ctrl + [panel num]</td>
          <td>Show nth panel</td>
        </tr>
        <tr>
          <td>ctrl + § or ctrl + `</td>
          <td>Hide focused panel</td>
        </tr>
        <tr>
          <td>ctrl + enter</td>
          <td>If console visible: run JS in console<br>If live visible: render with alerts, prompts &amp; confirms</td>
        </tr>
        <tr>
          <td>ctrl + /</td>
          <td>Toggle comment on single line</td>
        </tr>
        <tr>
          <td>ctrl + alt + .</td>
          <td>Close current HTML element</td>
        </tr>
        <tr>
          <td>esc</td>
          <td>Code complete (JavaScript only)</td>
        </tr>
        <tr>
          <td>ctrl + s</td>
          <td>Save current Bin</td>
        </tr>
        <tr>
          <td>ctrl + shift + s</td>
          <td>Clone current Bin</td>
        </tr>
        <tr>
          <td>tab</td>
          <td>Indents selected lines</td>
        </tr>
        <tr>
          <td>shift + tab</td>
          <td>Unindents selected lines</td>
        </tr>
        <tr><td colspan="2"><br><small>Note that Mac users can use cmd in place of ctrl</small></td></tr>
      </tbody>
    </table>
  </div>
</div>
<script>
<?php
  // assumes http - if that's not okay, this need to be changed
  $url = 'http://' . $_SERVER['HTTP_HOST'] . '/' . $code_id . ($revision == 1 ? '' : '/' . $revision);
  if (!$ajax) {
    echo 'var template = ';
  }
  // doubles as JSON
  echo '{"url":"' . $url . '","html" : ' . encode($html) . ',"css":' . encode($css) . ',"javascript":' . encode($javascript) . '}';
?>
</script>
<script>jsbin = { root: "<?php echo HOST ?>", version: "<?php echo VERSION?>" }; tips = <?php echo file_get_contents('tips.json')?>;</script>
<script src="<?php echo ROOT?>js/<?php echo VERSION?>/jsbin.js"></script>
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
<?php
  showSaved($home);
?>
</body>
</html>
