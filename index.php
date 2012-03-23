<?php 

include('app.php'); 

if (false && (@$_POST['html'] || @$_POST['javascript'])) {
  $jsonReplaces = array(array("\\", "/", "\n", "\t", "\r", "\b", "\f", '"'), array('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"'));
  if (@$_POST['html']) {
    $html = str_replace($jsonReplaces[0], $jsonReplaces[1], $_POST['html']);
  } else {
    $html = '';
  }
  if (@$_POST['javascript']) {
    $javascript = str_replace($jsonReplaces[0], $jsonReplaces[1], $_POST['javascript']);
  } else {
    $javascript = '';
  }

  if ($html == '') {
    // if there's no HTML, let's pop some simple HTML in place to give the JavaScript
    // some context to run inside of
    list($latest_revision, $defhtml, $defjavascript) = getCode($code_id, $revision, true);
    $html = $defhtml;
  }
} else {
  list($code_id, $revision) = getCodeIdParams($request);

  $edit_mode = false;

  if ($code_id) {
    list($latest_revision, $html, $javascript) = getCode($code_id, $revision, true);
  } else {
    list($latest_revision, $html, $javascript) = defaultCode();
  } 
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
<html lang="en">
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
      <a class="tab button source group left" accesskey="1" href="#source">Code</a>
      <a class="tab button preview group right gap" accesskey="2" href="#preview" title="Run with alerts, prompts, etc">Render</a>
      <a title="Revert" class="button light group left" id="revert" href="#"><img class="enabled" src="<?php echo ROOT?>images/revert.png" /><img class="disabled" src="<?php echo ROOT?>images/revert-disabled.png" /></a>
    <?php if ($code_id) : ?>
      <a id="jsbinurl" class="button group light left" href="http://<?php echo $_SERVER['HTTP_HOST'] . ROOT . $code_id?>"><?php echo $_SERVER['HTTP_HOST'] . ROOT . $code_id?></a>

      <div class="button group gap right tall">
        <a href="<?php echo ROOT?>save" class="save title">Save</a>
        <a id="clone" title="Create a new copy" class="button clone group light" href="<?php echo ROOT?>clone">Clone</a>
        <a id="save" title="Save new a new revision" class="button light save group" href="<?php echo $code_id_path?>save">Save</a>
      <?php else : ?>
        <div class="button group gap left right">
          <a href="<?php echo ROOT?>save" class="save title">Save</a>
          <a id="save" title="Save new bin" class="button save group" href="<?php echo ROOT?>save">Save</a>
      <?php endif ?>
          <a id="download" title="Save to drive" class="button download group light" href="<?php echo ROOT?>download">Download</a>
          <a id="startingpoint" title="Set as starting code" class="button group" href="<?php echo ROOT?>save">As template</a>
      </div>

      <span id="panelsvisible" class="gap">View: 
        <input type="checkbox" data-panel="javascript" id="showjavascript"><label for="showjavascript">JavaScript</label>
        <input type="checkbox" data-panel="html" id="showhtml"><label for="showhtml">HTML</label>
        <input type="checkbox" data-panel="live" id="showlive"><label for="showlive">Real-time preview</label>
      </span>
    </div>
  </div>
  <div class="help">
    <ul class="flat">
      <li><a target="_blank" href="http://jsbin.tumblr.com">Help &amp; tutorials</a></li>
      <li class="prefsButton"><a href="#"><img src="/images/gear.png"></a></li>
    </ul>
  </div>
</div>
<div id="bin" class="stretch" style="opacity: 0; filter:alpha(opacity=0);">
  <div id="source" class="binview stretch">
    <div class="code stretch javascript">
      <div class="label"><p><strong id="jslabel">JavaScript</strong></p></div>
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="javascript"></textarea>
      </div>
    </div>
    <div class="code stretch html">
      <div class="label">
        <p>HTML</p>
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
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="html"></textarea>
      </div>
    </div>

  </div>
      <div id="live" class="stretch livepreview"><a href="<?php echo ROOT ?>live" target="_new" id="popout" class="popout button light left right">Pop out</a></div>
  <div id="preview" class="binview stretch"></div>
  <form method="post" action="<?php echo $code_id_path?>save">
    <input type="hidden" name="method" />
  </form>
</div>
<div id="tip"><p>You can jump to the latest bin by adding <code>/latest</code> to your URL</p><a class="dismiss" href="#">Dismiss x</a></div>
<div id="keyboardHelp">
  <div>
    <h2>Keyboard Shortcuts</h2>
    <table>
      <thead>
        <tr>
          <th>Shortcut</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ctrl + &rarr;</td>
          <td>Focus HTML panel</td>
        </tr>
        <tr>
          <td>ctrl + &larr;</td>
          <td>Focus JavaScript panel</td>
        </tr>
        <tr>
          <td>ctrl + 1</td>
          <td>Source tab</td>
        </tr>
        <tr>
          <td>ctrl + 2</td>
          <td>Rendered preview tab</td>
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
      </tbody>
    </table>
  </div>
</div>
<div class="prefsOverlay"></div>
<script>
<?php
  // assumes http - if that's not okay, this need to be changed
  $url = 'http://' . $_SERVER['HTTP_HOST'] . '/' . $code_id . ($revision == 1 ? '' : '/' . $revision);
  if (!$ajax) {
    echo 'var template = ';
  }
  // doubles as JSON
  echo '{"url":"' . $url . '","html" : ' . encode($html) . ',"javascript":' . encode($javascript) . '}';
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
</body>
</html>
