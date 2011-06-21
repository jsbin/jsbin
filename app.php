<?php
include('config.php'); // contains DB & important versioning

// echo $_SERVER['REQUEST_URI'] . "<br>";
// echo strpos($_SERVER['REQUEST_URI'], ROOT);
$pos = strpos($_SERVER['REQUEST_URI'], ROOT);
if ($pos !== false) $pos++;

$request = split('/', preg_replace('/^\//', '', preg_replace('/\/$/', '', preg_replace('/\?.*$/', '', substr($_SERVER['REQUEST_URI'], $pos) ))));

$action = array_pop($request);

$edit_mode = true; // determines whether we should go ahead and load index.php
$code_id = '';

// if it contains the x-requested-with header, or is a CORS request on GET only
$ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) || (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['REQUEST_METHOD'] == 'GET');

// respond to preflights
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  // return only the headers and not the content
  // only allow CORS if we're doing a GET - i.e. no saving for now.
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: X-Requested-With');
  }
  exit;
} else if ($ajax) {
  header('Access-Control-Allow-Origin: *');
}

// doesn't require a connection when we're landing for the first time
if ($action) {
  connect();
}

if (!$action) {
  // do nothing and serve up the page
} else if ($action == 'source' || $action == 'js') {
  header('Content-type: text/javascript');
  list($code_id, $revision) = getCodeIdParams($request);
  
  $edit_mode = false;
  
  if ($code_id) {
    list($latest_revision, $html, $javascript) = getCode($code_id, $revision);
  } else {
    list($html, $javascript) = defaultCode();
  }
  
  if ($action == 'js') {
    echo $javascript;
  } else {
    $url = HOST . $code_id . ($revision == 1 ? '' : '/' . $revision);
    if (!$ajax) {
      echo 'var template = ';
    }
    // doubles as JSON
    echo '{"url":"' . $url . '","html" : ' . encode($html) . ',"javascript":' . encode($javascript) . '}';
  }
} else if ($action == 'edit') {
  list($code_id, $revision) = getCodeIdParams($request);
  if ($revision == 'latest') {
    $latest_revision = getMaxRevision($code_id);
    header('Location: /' . $code_id . '/' . $latest_revision . '/edit');
    $edit_mode = false;
    
  }
} else if ($action == 'save') {
  list($code_id, $revision) = getCodeIdParams($request);

  $javascript = @$_POST['javascript'];
  $html = @$_POST['html'];
  $method = @$_POST['method'];
  
  // we're using stripos instead of == 'save' because the method *can* be "download,save" to support doing both
  if (stripos($method, 'save') !== false) {
    if (!$code_id) {
      $code_id = generateCodeId();
      $revision = 1;
    } else {
      $revision = getMaxRevision($code_id);
      $revision++;
    }

    $sql = sprintf('insert into sandbox (javascript, html, created, last_viewed, url, revision) values ("%s", "%s", now(), now(), "%s", "%s")', mysql_real_escape_string($javascript), mysql_real_escape_string($html), mysql_real_escape_string($code_id), mysql_real_escape_string($revision));
    $ok = mysql_query($sql);   
    
    // error_log('saved: ' . $code_id . ' - ' . $revision . ' -- ' . $ok . ' ' . strlen($sql));
    // error_log(mysql_error());
  }
  
  if (stripos($method, 'download') !== false) {
    // strip escaping (replicated from getCode method):
    $javascript = preg_replace('/\r/', '', $javascript);
    $html = preg_replace('/\r/', '', $html);
    $html = get_magic_quotes_gpc() ? stripslashes($html) : $html;
    $javascript = get_magic_quotes_gpc() ? stripslashes($javascript) : $javascript;
    
    if (!$code_id) {
      $code_id = 'untitled';
      $revision = 1;
    }
  }
  
  if ($ajax) {
    // supports plugins making use of JS Bin via ajax calls and callbacks
    if (@$_REQUEST['callback']) {
      echo $_REQUEST['callback'] . '("';
    }
    $url = HOST . $code_id . ($revision == 1 ? '' : '/' . $revision);
    if (isset($_REQUEST['format']) && strtolower($_REQUEST['format']) == 'plain') {
      echo $url;
    } else {
      echo '{ "url" : "' . $url . '", "edit" : "' . $url . '/edit", "html" : "' . $url . '/edit", "js" : "' . $url . '/edit" }';
    }
    
    if ($_REQUEST['callback']) {
      echo '")';
    }
  } else if (stripos($method, 'download') !== false) {
    $originalHTML = $html;
    list($html, $javascript) = formatCompletedCode($html, $javascript, $code_id, $revision);
    $ext = $originalHTML ? '.html' : '.js';
    header('Content-Disposition: attachment; filename="' . $code_id . ($revision == 1 ? '' : '.' . $revision) . $ext . '"');
    echo $originalHTML ? $html : $javascript;
    exit;
  } else {
    // code was saved, so lets do a location redirect to the newly saved code
    $edit_mode = false;
    if ($revision == 1) {
      header('Location: /' . $code_id . '/edit');
    } else {
      header('Location: /' . $code_id . '/' . $revision . '/edit');
    }
  }
  
  
} else if ($action) { // this should be an id
  $subaction = array_pop($request);
  
  if ($action == 'latest') {
    // find the latest revision and redirect to that.
    $code_id = $subaction;
    $latest_revision = getMaxRevision($code_id);
    header('Location: /' . $code_id . '/' . $latest_revision);
    $edit_mode = false;
  }
  
  // gist are formed as jsbin.com/gist/1234 - which land on this condition, so we need to jump out, just in case
  else if ($subaction != 'gist') {
    if ($subaction) {
      $code_id = $subaction;
      $revision = $action;
    } else {
      $code_id = $action;
      $revision = 1;
    }

    list($latest_revision, $html, $javascript) = getCode($code_id, $revision);
    list($html, $javascript) = formatCompletedCode($html, $javascript, $code_id, $revision);

    $html = preg_replace('/<\/body>/', googleAnalytics() . '</body>', $html);
    $html = preg_replace('/<\/body>/', '<script src="/js/render/edit.js"></script>' . "\n</body>", $html);


    if (false) {
      if (stripos($html, '<head>')) {
        $html = preg_replace('/<head>(.*)/', '<head><script>if (window.top != window.self) window.top.location.replace(window.location.href);</script>$1', $html);
      } else {
        // if we can't find a head element, brute force the framebusting in to the HTML
        $html = '<script>if (window.top != window.self) window.top.location.replace(window.location.href);</script>' . $html;
      }      
    }

    if (!$html && !$ajax) {
      $javascript = "/*\n  Created using " . HOST . "\n  Source can be edit via " . HOST . "$code_id/edit\n*/\n\n" . $javascript;
    }

    if (!$html) {
      header("Content-type: text/javascript");
    }

    echo $html ? $html : $javascript;
    $edit_mode = false;
  }
}

if (!$edit_mode || $ajax) {
  exit;
}

function connect() {
  // sniff, and if on my mac...
  $link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);    
  mysql_select_db(DB_NAME, $link);
}

function encode($s) {
  static $jsonReplaces = array(array("\\", "/", "\n", "\t", "\r", "\b", "\f", '"'), array('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"'));
  return '"' . str_replace($jsonReplaces[0], $jsonReplaces[1], $s) . '"';
}

function getCodeIdParams($request) {
  $revision = array_pop($request);
  $code_id = array_pop($request);
  
  if ($code_id == null) {
    $code_id = $revision;
    $revision = 1;
  }
  
  return array($code_id, $revision);
}

function getMaxRevision($code_id) {
  $sql = sprintf('select max(revision) as rev from sandbox where url="%s"', mysql_real_escape_string($code_id), mysql_real_escape_string($revision));
  $result = mysql_query($sql);
  $row = mysql_fetch_object($result);
  return $row->rev ? $row->rev : 0;
}

function formatCompletedCode($html, $javascript, $code_id, $revision) {
  global $ajax;
  
  $javascript = preg_replace('@</script@', "<\/script", $javascript);
  
  if (stripos($html, '%code%') === false) {
    $html = preg_replace('@</body>@', "<script>\n%code%\n</script>\n</body>", $html);
  }
  
  // removed the regex completely to try to protect $n variables in JavaScript
  $htmlParts = explode("%code%", $html);
  $html = $htmlParts[0] . $javascript . $htmlParts[1];
  
  $html = preg_replace("/%code%/", $javascript, $html);

  if (!$ajax && $code_id != 'jsbin') {
    $code_id .= $revision == 1 ? '' : '/' . $revision;
    $html = preg_replace('/<html(.*)/', "<html$1\n<!--\n\n  Created using " . HOST . "\n  Source can be edited via " . HOST . "$code_id/edit\n\n-->", $html);            
  }

  return array($html, $javascript);
}


function getCode($code_id, $revision, $testonly = false) {
  $sql = sprintf('select * from sandbox where url="%s" and revision="%s"', mysql_real_escape_string($code_id), mysql_real_escape_string($revision));
  $result = mysql_query($sql);
  
  if (!mysql_num_rows($result) && $testonly == false) {
    header("HTTP/1.0 404 Not Found");
    return defaultCode(true);
  } else if (!mysql_num_rows($result)) {
    return array($revision);
  } else {
    $row = mysql_fetch_object($result);
    
    // TODO required anymore? used for auto deletion
    $sql = 'update sandbox set last_viewed=now() where id=' . $row->id;
    mysql_query($sql);
    
    $javascript = preg_replace('/\r/', '', $row->javascript);
    $html = preg_replace('/\r/', '', $row->html);
    
    $revision = $row->revision;
    
    // return array(preg_replace('/\r/', '', $html), preg_replace('/\r/', '', $javascript), $row->streaming, $row->active_tab, $row->active_cursor);
    return array($revision, get_magic_quotes_gpc() ? stripslashes($html) : $html, get_magic_quotes_gpc() ? stripslashes($javascript) : $javascript, $row->streaming, $row->active_tab, $row->active_cursor);
  }
}

function defaultCode($not_found = false) {
  $library = '';
  
  $usingRequest = false;
  
  if (isset($_REQUEST['html']) || isset($_REQUEST['js'])) {
    $usingRequest = true;
  }
  
  if (@$_REQUEST['html']) {
    $html = $_REQUEST['html'];
  } else if ($usingRequest) {
    $html = '';
  } else {
    $html = <<<HERE_DOC
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
<title>JS Bin</title>
<!--[if IE]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<style>
  article, aside, figure, footer, header, hgroup, 
  menu, nav, section { display: block; }
</style>
</head>
<body>
  <p id="hello">Hello World</p>
</body>
</html>
HERE_DOC;
  } 

  $javascript = '';

  if (@$_REQUEST['js']) {
    $javascript = $_REQUEST['js'];
  } else if ($usingRequest) {
    $javascript = '';
  } else {
    if ($not_found) {
      $javascript = 'document.getElementById("hello").innerHTML = "<strong>This URL does not have any code saved to it.</strong>";';
    } else {
      $javascript = "if (document.getElementById('hello')) {\n  document.getElementById('hello').innerHTML = 'Hello World - this was inserted using JavaScript';\n}\n";
    }    
  }

  return array(get_magic_quotes_gpc() ? stripslashes($html) : $html, get_magic_quotes_gpc() ? stripslashes($javascript) : $javascript);
}

// I'd consider using a tinyurl type generator, but I've yet to find one.
// this method also produces *pronousable* urls
function generateCodeId($tries = 0) {
  $code_id = generateURL();
  
  if ($tries > 2) {
    $code_id .= $tries;
  }
  
  // check if it's free
  $sql = sprintf('select id from sandbox where url="%s"', mysql_real_escape_string($code_id));
  $result = mysql_query($sql);

  if (mysql_num_rows($result)) {
    $code_id = generateCodeId(++$tries);
  } else if ($tries > 10) {
    echo('Too many tries to find a new code_id - please contact using <a href="/about">about</a>');
    exit;
  } 
  
  return $code_id;
}

function generateURL() {
	// generates 5 char word
  $vowels = str_split('aeiou');
  $const = str_split('bcdfghjklmnpqrstvwxyz');
  
  $word = '';
  for ($i = 0; $i < 5; $i++) {
    if ($i % 2 == 0) { // even = vowels
      $word .= $vowels[rand(0, 4)]; 
    } else {
      $word .= $const[rand(0, 20)];
    } 
  }

	return $word;
}

function googleAnalytics() {
  return <<<HERE_DOC
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
var pageTracker = _gat._getTracker("UA-1656750-13");
pageTracker._trackPageview();
</script>
HERE_DOC;
}


?>
