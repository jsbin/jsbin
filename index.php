<?php

$request = split('/', preg_replace('/^\//', '', preg_replace('/\/$/', '', preg_replace('/\?.*$/', '', $_SERVER['REQUEST_URI']))));

#array_shift($request); // removes jsbin1/ directory

$action = array_pop($request);
$code_id = '';
$edit_mode = true;
$js_source = false;
$ajax = false;
$new = false;
$streaming_key = '';
$streaming_read_key = '';
$streaming = false;

if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
    $ajax = true;
}

if (@$_GET['theme']) {
  if (@$_GET['theme'] == 'light') {
    $_COOKIE['light'] = true;
  } else {
    $_COOKIE['light'] = false;
  }
}

if (is_dir('/Users/')) {
    $link = mysql_connect('localhost', 'root', '');    
} else {
    $link = mysql_connect('localhost', 'todged', 't0dg3d');
}

mysql_select_db('todged', $link);
deleteOld();

if ($action == 'save') {
    $update = false;
    
    if (@$_REQUEST['streaming_key']) {
        $streaming_key = $_REQUEST['streaming_key'];
        $sql = sprintf('select url, streaming_read_key from sandbox where streaming_key="%s"', mysql_real_escape_string($streaming_key));
        $results = mysql_query($sql);
        
        if ($ajax && mysql_num_rows($results)) {
            $row = mysql_fetch_object($results);
            $code_id = $row->url;
            $streaming_read_key = $row->streaming_read_key;
            $update = true;
            
            // send the comet update
            include('bayeux.php');
            $oPhomet = new Bayeux('http://127.0.0.1:8080/cometd/');

            if (get_magic_quotes_gpc()) {
                $js = stripslashes($_POST['javascript']);
                $h = stripslashes($_POST['html']);
            } else {
                $js = $_POST['javascript'];
                $h = $_POST['html'];
            }

            $resp = $oPhomet->publish('/jsbin/' . $streaming_read_key, array('javascript' => $js, 'html' => $h, 'tab' => @$_POST['tab'], 'cursor' => @$_POST['cursor']));

            echo $resp;                
        } else {
            $code_id = generateCodeId();
        }
    } else {
        $code_id = generateCodeId();
    }
    
    // check if it already exists
    if (get_magic_quotes_gpc()) {
        $javascript = stripslashes(@$_POST['javascript']);
        $html = stripslashes(@$_POST['html']);
    } else {
        $javascript = @$_POST['javascript'];
        $html = @$_POST['html'];
    }
    
    if (!$update && $ajax && !$html) {
      list($default_html, $default_javascript) = defaultCode();
      $html = $default_html;
    }
    
    if ($update) {
        $sql = sprintf('update sandbox set javascript="%s", html="%s", last_viewed=now(), active_tab="%s", active_cursor="%s" where url="%s"', mysql_real_escape_string(@$_POST['javascript']), mysql_real_escape_string(@$_POST['html']), mysql_real_escape_string(@$_POST['tab']), mysql_real_escape_string(@$_POST['cursor']), mysql_real_escape_string($code_id));
        mysql_query($sql);
    } else {
        $sql = 'select url from sandbox where javascript="' . mysql_real_escape_string($javascript) . '" and html="' . mysql_real_escape_string($html) . '"';
        $results = mysql_query($sql);

        if (mysql_num_rows($results)) {
            $row = mysql_fetch_object($results);
            $code_id = $row->url;
        } else {
            $sql = sprintf('insert into sandbox (javascript, html, created, last_viewed, url) values ("%s", "%s", now(), now(), "%s")', mysql_real_escape_string(@$_POST['javascript']), mysql_real_escape_string(@$_POST['html']), mysql_real_escape_string($code_id));
            mysql_query($sql);
        }        
    }

    if ($ajax && $update) {
        // echo 'true;';
    } else if ($ajax) {
        if (@$_REQUEST['callback']) {
          echo $_REQUEST['callback'] . '("';
        }
        $url = 'http://jsbin.com/' . $code_id;
        if (isset($_REQUEST['format']) && strtolower($_REQUEST['format']) == 'plain') {
          echo $url;          
        } else {
          echo '{ "url" : "' . $url . '", "edit" : "' . $url . '/edit", "html" : "' . $url . '/edit#html", "js" : "' . $url . '/edit#javascript" }';
        }
        
        if ($_REQUEST['callback']) {
          echo '")';
        }
    } else {
        header('Location: /' . $code_id . '/edit');
    }
    exit;
} else if ($action == 'edit') {
    $code_id = array_pop($request);

    // check if it's streaming
    $sql = sprintf('select streaming, streaming_read_key from sandbox where url="%s"', mysql_real_escape_string($code_id));
    $results = mysql_query($sql);
    if (mysql_num_rows($results)) {
        $row = mysql_fetch_object($results);
        $streaming = $row->streaming == 'y' ? true : false;
        $streaming_read_key = $row->streaming_read_key;
    }
} else if ($action == 'source' || $action == 'js') {
    header('Content-type: text/javascript');
    $code_id = array_pop($request);
    $edit_mode = false;
    $js_source = true;
}  else if ($action == 'stream') {
    $code_id = generateCodeId();
    $streaming_key = md5($code_id . time());
    $streaming_read_key = md5($code_id . 'read');
    
    list($html, $javascript) = defaultCode();
    
    $sql = sprintf('insert into sandbox (html, created, last_viewed, url, streaming, streaming_key, streaming_read_key) values ("%s", now(), now(), "%s", "y", "%s", "%s")', mysql_real_escape_string($html), mysql_real_escape_string($code_id), mysql_real_escape_string($streaming_key), mysql_real_escape_string($streaming_read_key));
    mysql_query($sql);
} else if ($action) { // it's actually the code_id
    $deep_action = array_pop($request);
    if ($deep_action == 'new') {
        $library = $action;
        $new = true;
    } else {
        $code_id = $action;
        $edit_mode = false;
    }
} else {

}

if ($ajax) {
    $edit_mode = false;
}


/**
 * VIEW
 */
 
if ($edit_mode) {
    include('sandbox.php');
} else {
    if (!$code_id) {
        list($html, $javascript) = defaultCode();
    } else {
        list($html, $javascript, $streaming, $tab, $cursor) = getCode($code_id);
    }
    
    if ($action == 'js') {
        echo stripslashes($javascript);
        // echo $javascript;
    } else if ($js_source) {
	$html = preg_replace("/\r/", '', $html);
        $html = "'" . join("','", split("\n", (get_magic_quotes_gpc() ? $html : preg_replace("/'/", "\\\'", $html)))) . "'";
        
        if (preg_match('/\/new\//i', $_SERVER['HTTP_REFERER']) && !isset($_GET['js'])) {
            $javascript = '';
        }
        
        $javascript = preg_replace("/\r/", '', $javascript);
        $javascript = "'" . join("','", split("\n", (preg_replace("/'/", "\\\'", $javascript)))) . "'";
        
        if ($ajax) {
?>
{html:[<?=$html?>].join("\n"),js:[<?=$javascript?>].join("\n"),tab:"<?=$tab?>",cursor:<?=$cursor?>}
<?php } else { ?>
htmlTemplate = [<?=$html?>].join("\n");javascriptTemplate = [<?=$javascript?>].join("\n");
<?php
        }
    } else {
        // generate as page
        // if (get_magic_quotes_gpc()) {
            $html = stripslashes($html);
        // }
        
        if (stripos($html, '%code%') === false) {
            $html = preg_replace('@</body>@', '<script type="text/javascript">%code%</script></body>', $html);
        }
        
        $html = preg_replace("/%code%/", $javascript, $html);
        $html = preg_replace('/<\/body>/', googleAnalytics() . '</body>', $html);
        
        if (!$ajax) {
            $html = preg_replace('/<html(.*)/', "<html$1\n\n<!--\n\n  Created using http://jsbin.com\n  Source can be edited via http://jsbin.com/$code_id/edit\n\n-->\n", $html);            
        }
        
        if (get_magic_quotes_gpc() || (!$html)) {
            $javascript = stripslashes($javascript);
        }
        
        if (!$html && !$ajax) {
            $javascript = "/*\n  Created using http://jsbin.com\n  Source can be edit via http://jsbin.com/$code_id/edit\n*/\n\n" . $javascript;
        }
        
        if (!$javascript && $streaming) {
            // $refresh = '<meta http-equiv="refresh" content="5" />';
            // $html = preg_replace('/<html(.*)/', "<html$1\n$refresh\n", $html);            
        }
        
        if (!$html) {
            header("Content-type: text/javascript");
        }

        echo $html ? $html : $javascript;
    }
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

function getCode($code_id) {    
    $sql = sprintf('select * from sandbox where url="%s"', mysql_real_escape_string($code_id));
    $result = mysql_query($sql);
    
    if (!mysql_num_rows($result)) {
        header("HTTP/1.0 404 Not Found");
        return defaultCode(true);
    } else {
        $row = mysql_fetch_object($result);
        // touch:
        $sql = 'update sandbox set last_viewed=now() where id=' . $row->id;
        mysql_query($sql);
        
        // escape in
        if (!get_magic_quotes_gpc()) {
            $javascript = str_replace('\\', '\\\\', $row->javascript);
            $html = str_replace('\\', '\\\\', $row->html);
        } else {
            $javascript = $row->javascript;
            $html = $row->html;
        }
        
        return array(preg_replace('/\r/', '', $html), preg_replace('/\r/', '', $javascript), $row->streaming, $row->active_tab, $row->active_cursor);
    }
}

function deleteOld() {
    // disabled the link rot
    // $sql = 'delete from sandbox where last_viewed < date_sub(now(), interval 3 month)';
    // mysql_query($sql);
    
    $sql = 'delete from sandbox where javascript=html and created=last_viewed';
//    mysql_query($sql);
}

function defaultCode($not_found = false) {
    $style = 'body { background-color: #000; font: 16px Helvetica, Arial; color: #fff; }';
    if (@$_COOKIE['light']) {
      $style = 'body { background-color: #fff; font: 16px Helvetica, Arial; color: #000; }';
    }
    
    $library = '';
    if (preg_match('/\/new\/jquery/i', $_SERVER['HTTP_REFERER'])) {
        $library = '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>' . "\n";
    } else if (preg_match('/\/new\/html5/i', $_SERVER['HTTP_REFERER']) && !@$_GET['html']) {
      $_GET['html'] = <<<HERE_DOC
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
{$library}<title>HTML 5 complete</title>
<!--[if IE]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<style>
  article, aside, dialog, figure, footer, header,
  hgroup, menu, nav, section { display: block; }
  {$style}
</style>
</head>
<body>
  <p>Hello from JS Bin with HTML5 sauce</p>
</body>
</html>
HERE_DOC;
    } 

    if (!@$_GET['html']) {
        $html = <<<HERE_DOC
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
{$library}<title>Sandbox</title>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
<style type="text/css" media="screen">
{$style}
</style>
</head>
<body>
  <p>Hello from JS Bin</p>
  <p id="hello"></p>
</body>
</html>
HERE_DOC;
    } else {
        $html = $_GET['html'];
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
	// generates 5 char word and 3 numbers
	$vowels = array('a', 'e', 'i', 'o', 'u');
	$const = array('b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z');

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
