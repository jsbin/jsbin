<?php 

include('app.php'); 

list($code_id, $revision) = getCodeIdParams($request);

$edit_mode = false;
$code = $code_id; // copy of the original url/code

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
<html id="jsbin" lang="en" class="<?php if ($embed) echo ' embed' ?>">
<head>
<meta charset=utf-8 />
<title>JS Bin - Collaborative JavaScript Debugging</title>
<link rel="icon" href="<?php echo ROOT ?>favicon.ico" />
<link rel="stylesheet" href="<?php echo ROOT?>css/style.css?<?php echo VERSION?>" type="text/css" />
<?php if (isset($custom['css'])) { ?>
<link rel="stylesheet" href="<?php echo ROOT . $custom['css']; ?>?<?php echo VERSION?>" type="text/css" />
<?php } ?>
</head>
<!--[if lt IE 7 ]><body class="source ie ie6"><![endif]--> 
<!--[if lt IE 8 ]><body class="source ie ie7"><![endif]--> 
<!--[if gte IE 8 ]><body class="source ie"><![endif]--> 
<!--[if !IE]><!--><body class="source"><!--<![endif]-->
<div id="control">
  <div class="control">
    <div class="buttons">
<?php if (!$embed) : ?>
      <div class="menu">
        <a href="#actionmenu" class="button button-dropdown group">File</a>
        <div class="dropdown" id="actionmenu">
          <div class="dropdownmenu">
            <a id="addmeta" title="Add meta data to bin" class="button group" href="#">Add description</a>
            <a title="Create milestone" class="button save group" href="<?php echo $code_id_path?>save">Create milestone</a>
            <a id="createnew" class="button group" title="Create fresh bin" href="<?=ROOT?>">New</a>
  <?php if ($home) : ?>
            <a href="#" class="button group homebtn">Open</a>
  <?php endif ?>
  <?php if ($code_id) : ?>
            <a id="clone" title="Create a new copy" class="button clone group" href="<?php echo ROOT?>clone">Clone</a>
  <?php else : ?>
            <!-- <a id="save" title="Save new bin" class="button save group" href="<?php echo ROOT?>save">Save</a> -->
  <?php endif ?>
            <a id="startingpoint" title="Set as starting code" class="button group" href="<?php echo ROOT?>save">Save as template</a>
            <a id="download" title="Save to local drive" class="button download group" href="<?php echo ROOT?>download">Download</a>
          </div>
        </div>
      </div><div class="menu">
        <a href="#include" class="button fake-dropdown group">Include
        <select id="library" class="xchosen">
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
        </a>
      </div>
<?php endif ?>
      <div id="panels"></div>
      <div class="help">
        <?php if ($code_id) : ?>
        <!-- <span class="meta"> -->
          <a title="Revert" class="button light group left" id="revert" href="#"><img class="enabled" src="<?php echo ROOT?>images/revert.png" /><img class="disabled" src="<?php echo ROOT?>images/revert-disabled.png" /></a>
          <a id="jsbinurl" target="_blank" class="button group light left right gap" href="http://<?php echo $_SERVER['HTTP_HOST'] . ROOT . $code_id?>"><?php echo $_SERVER['HTTP_HOST'] . ROOT . $code_id?></a>
        <!-- </span> -->
        <?php endif; ?>
        <?php if (!$embed) : ?>
          <?php if ($home) : ?>
        <div class="menu">
          <div class="group">
            <a href="#" class="button homebtn"><?php echo $home ?></a><a href="#homemenu" class="button button-dropdown"></a>
          </div>
          <div class="dropdown" id="homemenu">
            <div class="dropdownmenu">
              <a id="logout" class="button group" href="<?php echo ROOT ?>logout">Logout</a>
            </div>
          </div>
        </div>
          <?php else : ?>
        <a href="#" class="button" id="loginbtn">Log in</a>
          <?php endif ?>
        <?php else: ?>
        <a href="http://<?php echo $_SERVER['HTTP_HOST'] . ROOT . $code_id ?>/edit" class="button">Edit</a>
        <?php endif ?>
        <a href="http://jsbin.tumblr.com" class="button group">Help</a>
      </div>

    </div>
  </div>
</div>
<div id="bin" class="stretch" style="opacity: 0; filter:alpha(opacity=0);">
  <div id="source" class="binview stretch">
  </div>
  <div id="panelswaiting">
    <div class="code stretch html panel">
      <div class="label">
        <span class="name"><strong>HTML</strong></span>
      </div>
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="html"></textarea>
      </div>
    </div>
    <div class="code stretch javascript panel">
      <div class="label"><span class="name"><strong>JavaScript</strong></span></div>
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="javascript"></textarea>
      </div>
    </div>
    <div class="code stretch css panel">
      <div class="label"><span class="name"><strong id="csslabel">CSS</strong></span></div>
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="css"></textarea>
      </div>
    </div>
    <div class="stretch console panel">
      <div class="label">
        <span class="name"><strong>Console</strong></span>
        <span class="options">
          <button id="runconsole" title="ctrl + enter">Run</button>
        </span>
      </div>
      <div id="console" class="stretch"><ul id="output"></ul></div>
    </div>
    <div id="live" class="stretch live panel">
      <div class="label">
        <span class="name"><strong>Output</strong></span>
        <span class="options">
          <button id="runwithalerts" title="ctrl + enter
Include alerts, prompts &amp; confirm boxes">Run with alerts</button> 
          <?php if (!$embed) : ?><label>Real time JS<input type="checkbox" id="enablejs"></label><?php endif; ?>
<a id="popout" target="_blank" href="<?php echo $code_id_path?>preview"><img src="<?php echo ROOT ?>images/popout.png"></a>
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
        <label for="email">Email</label><input id="email" type="email" name="email">
        <p>Email is just used to reset your password - it's not used for anything else.</p>
      </div>
      <div>
        <input type="submit" value="Log in">
      </div>
    </form>
  </div>
</div>
<div id="keyboardHelp" class="modal">
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
        <td>ctrl + alt + [panel num]</td>
        <td>Show nth panel</td>
      </tr>
      <tr>
        <td>ctrl + alt + §<br>(or `)</td>
        <td>Hide focused panel</td>
      </tr>
      <tr>
        <td>ctrl + enter</td>
        <td>Re-render JavaScript.<br>If console visible: run JS in console</td>
      </tr>
      <tr>
        <td>ctrl + l</td>
        <td>Clear the console</td>
      </tr>
      <tr>
        <td>ctrl + \</td>
        <td>Auto hide navigation bar</td>
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
        <td>Code complete (JavaScript only) and close open overlays - like this</td>
      </tr>
      <tr>
        <td>ctrl + shift + s</td>
        <td>Clone current Bin</td>
      </tr>
      <tr>
        <td>cmd + ] (or tab)</td>
        <td>Indents selected lines</td>
      </tr>
      <tr>
        <td>cmd + [ (or shift + tab)</td>
        <td>Unindents selected lines</td>
      </tr>
      <tr><td colspan="2"><br><small>Note that Mac users can use cmd in place of ctrl</small></td></tr>
    </tbody>
  </table>
</div>
<script>
<?php
  // assumes http - if that's not okay, this need to be changed
  $url = 'http://' . $_SERVER['HTTP_HOST'] . '/' . $code_id . ($revision == 1 ? '' : '/' . $revision);
  if (!$ajax) {
    echo 'var template = ';
  }
  // doubles as JSON
  echo '{"url":"' . $url . '","html" : ' . encode($html) . ',"css":' . encode($css) . ',"javascript":' . encode($javascript) . '};';
?>
</script>
<script>
var jsbin = { settings: { panels: [] }, state: { embed: <?php echo isset($embed) && $embed ? 'true' : 'false' ?>, stream: false, code: "<?php echo $code ?>", revision: <?php echo $revision ?> }, root: "<?php echo 'http://' . $_SERVER['HTTP_HOST'] . ROOT ?>", version: "<?php echo VERSION?>" }; 
<?php if (isset($custom['settings'])) { ?>
jsbin.settings = <?php echo json_encode($custom['settings']); ?>;
<?php } ?>
tips = <?php echo file_get_contents('tips.json')?>;
</script>
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
  if (!$embed) showSaved($home);
?>
<div id="urlHelp" class="modal">
  <p>Where the url may be http://jsbin.com/abc the following url fragments can be added to the url to view it differently.</p>
  <h2>JS Bin URLs</h2>
  <table>
    <thead>
      <tr>
        <th class="shortcut">URL</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>/</td>
        <td>Show the full rendered output</td>
      </tr>
      <tr>
        <td>/edit</td>
        <td>Edit the current bin</td>
      </tr>
      <tr>
        <td>.js</td>
        <td>Load only the JavaScript for a bin</td>
      </tr>
      <tr>
        <td>.css</td>
        <td>Load only the CSS for a bin</td>
      </tr>
    </tbody>
  </table>
</div>
</body>
</html>
