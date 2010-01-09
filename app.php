<?php
include('config.php'); // contains DB & important versioning
$request = split('/', preg_replace('/^\//', '', preg_replace('/\/$/', '', preg_replace('/\?.*$/', '', $_SERVER['REQUEST_URI']))));
$action = array_pop($request);
$edit_mode = true; // determines whether we should go ahead and load index.php
$code_id = '';
$ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']);

// doesn't require a connection when we're landing for the first time
if ($action) {
  // connect();
}

if (!$action) {
  // do nothing and serve up the page
} else if ($action == 'source' || $action == 'js') {
  header('Content-type: text/javascript');
  $code_id = array_pop($request);
  $edit_mode = false;
  
  if ($code_id) {
    list($html, $javascript) = getCode($code_id);
  } else {
    list($html, $javascript) = defaultCode();
  }
  
  echo 'var template = ' . json_encode(array('html' => $html, 'javascript' => $javascript)) . ';';
} else if ($action == 'edit') {
  $code_id = array_pop($request);
  
} else if ($action == 'save') {
  
} else if ($action) { // this should be an id
  
}

if (!$edit_mode || $ajax) {
  exit;
}

function connect() {
  // sniff, and if on my mac...
  $link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);    
  mysql_select_db(DB_NAME, $link);
}

// returns the app loaded with json html + js content
function edit() {
  
}

// saves current state - should I store regardless of content, to start their own
// milestones? 
function save() {
  
}

function getCode($code_id) {
  $sql = sprintf('select * from sandbox where url="%s"', mysql_real_escape_string($code_id));
  $result = mysql_query($sql);
  
  if (!mysql_num_rows($result)) {
    header("HTTP/1.0 404 Not Found");
    return defaultCode(true);
  } else {
    $row = mysql_fetch_object($result);
    
    // TODO required anymore? used for auto deletion
    $sql = 'update sandbox set last_viewed=now() where id=' . $row->id;
    mysql_query($sql);
    
    if (!get_magic_quotes_gpc()) {
      // escape in - frankly: fucking stupid.
      $javascript = str_replace('\\', '\\\\', $row->javascript);
      $html = str_replace('\\', '\\\\', $row->html);
    } else {
      $javascript = $row->javascript;
      $html = $row->html;
    }
    
    return array(preg_replace('/\r/', '', $html), preg_replace('/\r/', '', $javascript), $row->streaming, $row->active_tab, $row->active_cursor);
  }
}

function defaultCode($not_found = false) {
  $library = '';
  
  if (@$_GET['html']) {
    $html = $_GET['html'];
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
  article, aside, dialog, figure, footer, header,
  hgroup, menu, nav, section { display: block; }
</style>
</head>
<body>
  <p id="hello">Hello World</p>
</body>
</html>
HERE_DOC;
  } 

  $javascript = '';

  if (!@$_GET['js']) {
    if ($not_found) {
      $javascript = 'document.getElementById("hello").innerHTML = "<strong>This URL does not have any code saved to it.</strong>";';
    } else {
      $javascript = "if (document.getElementById('hello')) {\n  document.getElementById('hello').innerHTML = 'Hello World - this was inserted using JavaScript';\n}\n";
    }
  } else {
    $javascript = $_GET['js'];
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

?>