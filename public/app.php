<?php
// date_default_timezone_set('UTC');

date_default_timezone_set('Europe/London');

require_once('../vendor/mustache.php');

include('config.php'); // contains DB & important versioning
include('blacklist.php'); // rules to *try* to prevent abuse of jsbin

$host = 'http://' . $_SERVER['HTTP_HOST'];

$pos = strpos($_SERVER['REQUEST_URI'], ROOT);
if ($pos !== false) $pos = strlen(ROOT);

$request_uri = substr($_SERVER['REQUEST_URI'], $pos);
$home = isset($_COOKIE['home']) ? $_COOKIE['home'] : '';

// if ($request_uri == '' && $home && stripos($_SERVER['HTTP_HOST'], $home . '/') !== 0) {
//   header('Location: ' . HOST . $home . '/');
//   exit;
// }

$request = split('/', preg_replace('/^\//', '', preg_replace('/\/$/', '', preg_replace('/\?.*$/', '', $request_uri ))));

$action = array_pop($request);

if (stripos($action, '.') !== false) {
  $parts = split('\.', $action);
  array_push($request, $parts[0]);
  $action = $parts[1];
}

// remove the home path section from the request so we can correctly read the next action
if ($action == $home) {
  $action = array_pop($request);
}

// allow us to request .html
if ($action == 'html') {
  $action = array_pop($request);
}

$quiet = false;
if ($action == 'quiet') {
  $quiet = true;
  $action = array_pop($request);
}

// allows the user to save over existing jsbins

$edit_mode = true; // determines whether we should go ahead and load index.php
$code_id = '';

// if it contains the x-requested-with header, or is a CORS request on GET only
$ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) || (stripos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false && $_SERVER['REQUEST_METHOD'] == 'GET');

$no_code_found = false;

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
// if ($action) {
  connect();
// }

if (!$action) {
  // do nothing and serve up the page
} else if ($action == 'sethome') {
  if ($ajax) {
    // 1. encode the key
    // 2. lookup the name
    // 3.1. if no name - it's available - store
    // 3.2. if name - check key against encoded key
    // 3.2.1. if match, return ok
    //        else return fail
    
    $key = sha1($_POST['key']);
    $name = $_POST['name'];
    $sql = sprintf('select * from ownership where name="%s"', mysql_real_escape_string($name));
    $result = mysql_query($sql);

    header('content-type: application/json');
  
    if (!mysql_num_rows($result)) {
      // store and okay (note "key" is a reserved word - typical!)
      $sql = sprintf('insert into ownership (name, `key`) values ("%s", "%s")', mysql_real_escape_string($name), mysql_real_escape_string($key));
      $ok = mysql_query($sql);
      if ($ok) {
        echo json_encode(array('ok' => true, 'key' => $key, 'created' => true));
      } else {
        echo json_encode(array('ok' => false, 'error' => mysql_error()));
      }
    } else {
      // check key
      $row = mysql_fetch_object($result);
      if ($row->key == $key) {
        echo json_encode(array('ok' => true, 'key' => $key, 'created' => false));
      } else {
        echo json_encode(array('ok' => false));
      }
    }

    exit;
  }
} else if ($action == 'list' || $action == 'show') {
  showSaved($request[0] ? $request[0] : $home);
  // could be listed under a user OR could be listing all the revisions for a particular bin
  
  exit();
} else if ($action == 'source' || $action == 'js' || $action == 'css' || $action == 'json') {
  list($code_id, $revision) = getCodeIdParams($request);
  
  $edit_mode = false;
  
  if ($code_id) {
    list($latest_revision, $html, $javascript, $css) = getCode($code_id, $revision);
  } else {
    list($latest_revision, $html, $javascript, $css) = defaultCode();
  }
  
  if ($action == 'js') {
    header('Content-type: text/javascript');
    echo $javascript;
  } else if ($action == 'json') {
    header('Content-type: application/json');
    echo $javascript;
  } else if ($action == 'css') {
    header('Content-type: text/css');
    echo $css;
  } else {
    header('Content-type: application/json');
    $url = ROOT . $code_id . ($revision == 1 ? '' : '/' . $revision);
    if (!$ajax) {
      echo 'var template = ';
    }
    // doubles as JSON
    echo '{"url":"' . $url . '","html" : ' . encode($html) . ',"css":' . encode($css) . ',"javascript":' . encode($javascript) . '}';
  }
} else if ($action == 'edit') {
  list($code_id, $revision) = getCodeIdParams($request);
  if ($revision == 'latest') {
    $latest_revision = getMaxRevision($code_id);
    header('Location: /' . $code_id . '/' . $latest_revision . '/edit');
    $edit_mode = false;
    
  }
} else if ($action == 'save' || $action == 'clone') {
  list($code_id, $revision) = getCodeIdParams($request);

  $javascript = @$_POST['javascript'];
  $html = @$_POST['html'];
  $css = @$_POST['css'];
  $method = @$_POST['method'];
  $stream = isset($_POST['stream']) ? true : false;
  $streaming_key = '';
  $allowUpdate = false;

  // we're using stripos instead of == 'save' because the method *can* be "download,save" to support doing both
  if (stripos($method, 'save') !== false) {

    if (stripos($method, 'new') !== false) {
      $code_id = false;
    }

    if (!$code_id) {
      $code_id = generateCodeId();
      $revision = 1;
    } else {
      $revision = getMaxRevision($code_id);
      $revision++;
    }

    $rewriteKey = md5(strval($code_id) . strval($revision) . strval(mt_rand()));

    $sql = sprintf('insert into sandbox (javascript, css, html, created, last_viewed, url, revision, streaming_key) values ("%s", "%s", "%s", now(), now(), "%s", "%s", "%s")', mysql_real_escape_string($javascript), mysql_real_escape_string($css), mysql_real_escape_string($html), mysql_real_escape_string($code_id), mysql_real_escape_string($revision), mysql_real_escape_string($rewriteKey));
    // a few simple tests to pass before we save
    if (($html == '' && $html == $javascript && $css == '')) {
      // entirely blank isn't going to be saved.
    } else {
      if (!noinsert($html, $javascript)) {
        $ok = mysql_query($sql);

        if ($ok) {
          $allowUpdate = $rewriteKey;
        }

        if ($home && $ok) {
          // first check they have write permission for this home
          $sql = sprintf('select * from ownership where name="%s" and `key`="%s"', mysql_real_escape_string($home), mysql_real_escape_string($_COOKIE['key']));
          $result = mysql_query($sql);
          if (mysql_num_rows($result) == 1) {
            $sql = sprintf('insert into owners (name, url, revision) values ("%s", "%s", "%s")', mysql_real_escape_string($home), mysql_real_escape_string($code_id), mysql_real_escape_string($revision));
            $ok = mysql_query($sql);
          }
        }
      }
    }
    
  } else if ($method === 'update') {
    $checksum = $_POST['checksum'];
    $code_id = $_POST['code'];
    $revision = $_POST['revision'];
    $panel = $_POST['panel'];
    $content = $_POST['content'];

    $sql = sprintf('update sandbox set %s="%s", created=now() where url="%s" and revision="%s" and streaming_key="%s" and streaming_key!=""', mysql_real_escape_string($panel), mysql_real_escape_string($content), mysql_real_escape_string($code_id), mysql_real_escape_string($revision), mysql_real_escape_string($checksum));

    // TODO run against blacklist
    $ok = mysql_query($sql);
    $updated = mysql_affected_rows();
    if ($ok && $updated === 1) {
      $data = array(ok => true, error => false);
      echo json_encode($data);
      exit;
    } else {
      $data = array(
        error => true,
        message => 'checksum did not check out on revision update'
      );
      echo json_encode($data);
      exit;
    }
  }

  /** 
   * Download
   *
   * Now allow the user to download the individual bin.
   * TODO allow users to download *all* their bins.
   **/
  if (stripos($method, 'download') !== false) {
    // strip escaping (replicated from getCode method):
    $javascript = preg_replace('/\r/', '', $javascript);
    $html = preg_replace('/\r/', '', $html);
    $css = preg_replace('/\r/', '', $css);
    $html = get_magic_quotes_gpc() ? stripslashes($html) : $html;
    $javascript = get_magic_quotes_gpc() ? stripslashes($javascript) : $javascript;
    $css = get_magic_quotes_gpc() ? stripslashes($css) : $css;
    
    if (!$code_id) {
      $code_id = 'untitled';
      $revision = 1;
    }
  }

  // If they're saving via an XHR request, then second back JSON or JSONP response
  if ($ajax) {
    // supports plugins making use of JS Bin via ajax calls and callbacks
    if (array_key_exists('callback', $_REQUEST)) {
      echo $_REQUEST['callback'] . '("';
    }
    $url = ROOT . $code_id . ($revision == 1 ? '' : '/' . $revision);
    if (isset($_REQUEST['format']) && strtolower($_REQUEST['format']) == 'plain') {
      echo $url;
    } else {
      // FIXME - why *am* I sending "js" and "html" with the url to the bin?
      $data = array(
        code => $code_id,
        root => PATH,
        created => date('c', time()),
        revision => $revision,
        url => $url,
        edit => $url . '/edit',
        html => $url . '/edit',
        js => $url . '/edit',
        title => getTitleFromCode(array(html => $html, javascript => $javascript)),
        allowUpdate => $allowUpdate === false ? false : true,
        checksum => $allowUpdate
      );
      echo json_encode($data);
      // echo '{ "code": "' . $code_id . '", "root": "' . PATH . '", "created": "' . date('c', time()) . '", "revision": ' . $revision . ', "url" : "' . $url . '", "edit" : "' . $url . '/edit", "html" : "' . $url . '/edit", "js" : "' . $url . '/edit", "title": "' .  .'" }';
    }
    
    if (array_key_exists('callback', $_REQUEST)) {
      echo '")';
    }
  } else if (stripos($method, 'download') !== false) {
    // actually go ahead and send a file to prompt the browser to download
    $originalHTML = $html;
    list($html, $javascript, $css) = formatCompletedCode($html, $javascript, $css, $code_id, $revision);
    $ext = $originalHTML ? '.html' : '.js';
    header('Content-Disposition: attachment; filename="' . $code_id . ($revision == 1 ? '' : '.' . $revision) . $ext . '"');
    echo $originalHTML ? $html : $javascript;
    exit;
  } else {
    // code was saved, so lets do a location redirect to the newly saved code
    $edit_mode = false;
    if ($revision == 1) {
      header('Location: ' . ROOT . $code_id . '/edit');
    } else {
      header('Location: ' . ROOT . $code_id . '/' . $revision . '/edit');
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
    if ($subaction && is_numeric($action)) {
      $code_id = $subaction;
      $revision = $action;
    } else {
      $code_id = $action;
      $revision = 1;
    }
    
    list($latest_revision, $html, $javascript, $css) = getCode($code_id, $revision);
    list($html, $javascript, $css) = formatCompletedCode($html, $javascript, $css, $code_id, $revision);
    
    global $quiet;

    // using new str_lreplace to ensure only the *last* </body> is replaced.
    // FIXME there's still a bug here if </body> appears in the script and not in the
    // markup - but I'll fix that later
    if (!$quiet) {
      $html = str_lreplace('</body>', '<script src="/js/render/edit.js"></script>' . "\n</body>", $html);
    }

    if ($no_code_found == false) {
      $html = str_lreplace('</body>', googleAnalytics() . '</body>', $html);
    }

    if (false) {
      if (stripos($html, '<head>')) {
        $html = preg_replace('/<head>(.*)/', '<head><script>if (window.top != window.self) window.top.location.replace(window.location.href);</script>$1', $html);
      } else {
        // if we can't find a head element, brute force the framebusting in to the HTML
        $html = '<script>if (window.top != window.self) window.top.location.replace(window.location.href);</script>' . $html;
      }      
    }

    if (!$html && !$ajax) {
      $javascript = "/*\n  Created using " . ROOT . "\n  Source can be edit via " . $host . ROOT . "$code_id/edit\n*/\n\n" . $javascript;
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

function str_lreplace($search, $replace, $subject) {
  $pos = strrpos($subject, $search);

  if ($pos === false) {
    return $subject;
  } else {
    return substr_replace($subject, $replace, $pos, strlen($search));
  }
}


function getCodeIdParams($request) {
  global $home;

  $revision = array_pop($request);
  $code_id = array_pop($request);

  
  if ($code_id == null || ($home && $home == $code_id)) {
    $code_id = $revision;
    $revision = 1;
  }
  
  return array($code_id, $revision);
}

function getMaxRevision($code_id) {
  $sql = sprintf('select max(revision) as rev from sandbox where url="%s"', mysql_real_escape_string($code_id));
  $result = mysql_query($sql);
  $row = mysql_fetch_object($result);
  return $row->rev ? $row->rev : 0;
}

function formatCompletedCode($html, $javascript, $css, $code_id, $revision) {
  global $ajax, $quiet;
  
  $javascript = preg_replace('@</script@', "<\/script", $javascript);
  
  if ($quiet && $html) {
    $html = '<script>window.onfocus=function(){return false;};window.open=window.print=window.confirm=window.prompt=window.alert=function(){};</script>' . $html;
  } 
  
  if ($html && stripos($html, '%code%') === false && strlen($javascript)) {
    $close = '';
    if (stripos($html, '</body>') !== false) {
      $parts = explode("</body>", $html);
      $html = $parts[0];
      $close = count($parts) == 2 ? '</body>' . $parts[1] : '';
    }
    $html .= "<script>\n" . $javascript . "\n</script>\n" . $close;
  } else if ($javascript) {
    // removed the regex completely to try to protect $n variables in JavaScript
    $htmlParts = explode("%code%", $html);
    $html = $htmlParts[0] . $javascript . $htmlParts[1];

    $html = preg_replace("/%code%/", $javascript, $html);
  }

  // repeat for CSS
  if ($html && stripos($html, '%css%') === false && strlen($css)) {
    $close = '';
    if (stripos($html, '</head>') !== false) {
      $parts = explode("</head>", $html);
      $html = $parts[0];
      $close = count($parts) == 2 ? '</head>' . $parts[1] : '';
    }
    $html .= "<style>\n" . $css . "\n</style>\n" . $close;
  } else if ($css) {
    // TODO decide whether this is required for the JS
    // removed the regex completely to try to protect $n variables in JavaScript
    $htmlParts = explode("%css%", $html);
    $html = $htmlParts[0] . $css . $htmlParts[1];

    $html = preg_replace("/%css%/", $css, $html);
  }

  if (!$ajax && $code_id != 'jsbin') {
    $code_id .= $revision == 1 ? '' : '/' . $revision;
    $html = preg_replace('/<html(.*)/', "<html$1\n<!--\n\n  Created using " . ROOT . "\n  Source can be edited via " . $host . ROOT . "$code_id/edit\n\n-->", $html);            
  }

  return array($html, $javascript, $css);
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
    $css = preg_replace('/\r/', '', $row->css);

    $revision = $row->revision;

    // return array(preg_replace('/\r/', '', $html), preg_replace('/\r/', '', $javascript), $row->streaming, $row->active_tab, $row->active_cursor);
    return array($revision, get_magic_quotes_gpc() ? stripslashes($html) : $html, get_magic_quotes_gpc() ? stripslashes($javascript) : $javascript, get_magic_quotes_gpc() ? stripslashes($css) : $css);
  }
}

function defaultCode($not_found = false) {
  $library = '';
  global $no_code_found;
  
  if ($not_found) {
    $no_code_found = true;
  }
  
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
</head>
<body>
  
</body>
</html>
HERE_DOC;
  } 

  $javascript = '';

  if (@$_REQUEST['js']) {
    $javascript = $_REQUEST['js'];
  } else if (@$_REQUEST['javascript']) {
    $javascript = $_REQUEST['javascript']; // it's beyond me why I ever used js?
  } else if ($usingRequest) {
    $javascript = '';
  } else {
    if ($not_found) {
      $javascript = 'document.getElementById("hello").innerHTML = "<strong>This URL does not have any code saved to it.</strong>";';
    } else {
      $javascript = "/* your JavaScript here - remember you can override this default template using 'Save'->'As Template' */\n";
    }    
  }

  return array(0, get_magic_quotes_gpc() ? stripslashes($html) : $html, get_magic_quotes_gpc() ? stripslashes($javascript) : $javascript, '');
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
  for ($i = 0; $i < 6; $i++) {
    if ($i % 2 == 0) { // even = vowels
      $word .= $vowels[rand(0, 4)]; 
    } else {
      $word .= $const[rand(0, 20)];
    } 
  }

	return $word;
}

function googleAnalytics() {
  global $quiet;
  if (!$quiet) {
    return <<<HERE_DOC
<script>var _gaq=[['_setAccount','UA-1656750-13'],['_trackPageview']];(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.src='//www.google-analytics.com/ga.js';s.parentNode.insertBefore(g,s)})(document,'script')</script>
HERE_DOC;
  } else {
    return '';
  }
}

function getTitleFromCode($bin) {
  preg_match('/<title>(.*?)<\/title>/', $bin['html'], $match);
  preg_match('/<body.*?>(.*)/s', $bin['html'], $body);
  $title = '';
  if (count($body)) {
    $title = $body[1];
    if (get_magic_quotes_gpc() && $body[1]) {
      $title = stripslashes($body[1]);
    }
    $title = trim(preg_replace('/\s+/', ' ', strip_tags($title)));
  }
  if (!$title && $bin['javascript']) {
    $title = preg_replace('/\s+/', ' ', $bin['javascript']);
  }

  if (!$title && count($match)) {
    $title = get_magic_quotes_gpc() ? stripslashes($match[1]) : $match[1];
  }

  return $title;
}

function showSaved($name) {
  $sql = sprintf('select * from owners where name="%s" order by url, revision desc', mysql_real_escape_string($name));
  $result = mysql_query($sql);

  $bins = array();
  $order = array();

  // this is lame, but the optimisation was aweful on the joined version - 3-4 second query
  // with a full table scan - not good. I'm worried this doesn't scale properly, but I guess
  // I could mitigate this with paging on the UI - just a little...?
  if ($result) {
    while ($saved = mysql_fetch_object($result)) {
      $sql = sprintf('select * from sandbox where url="%s" and revision="%s"', mysql_real_escape_string($saved->url), mysql_real_escape_string($saved->revision));
      $binresult = mysql_query($sql);
      $bin = mysql_fetch_array($binresult);

      if (!isset($bins[$saved->url])) {
        $bins[$saved->url] = array();
      }

      $bins[$saved->url][] = $bin;

      if (isset($order[$saved->url])) {
        if (@strtotime($order[$saved->url]) < @strtotime($bin['created'])) {
          $order[$saved->url] = $bin['created'];
        }
      } else {
        $order[$saved->url] = $bin['created'];
      }
    }
  }

  if (count($bins)) {
    include_once('list-history.php');
  } else {
    // echo 'nothing found :(';
    // echo 'nothing found';
  } 
  
}

function formatURL($code_id, $revision) {
  if ($revision != 1 && $revision) {
    $code_id .= '/' . $revision;
  }
  $code_id_path = ROOT;
  if ($code_id) {
    $code_id_path = ROOT . $code_id . '/';
  }
  return $code_id_path;
}

?>
