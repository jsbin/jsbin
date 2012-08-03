<?php
$ajax = (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest');

$taken_usernames = array(
    'remy',
    'julie',
    'andrew',
    'andy',
    'simon',
    'chris',
    'nick'
);


if ($ajax) {
    if ($action == 'register') {
        $resp = check_username($_REQUEST['username']);

        if ($resp['ok']) {
            $message = 'All details fine';
        } else {
            $message = 'There was a problem with your registration details';
            $error = $resp;
        }
    } else if ($action == 'check_username' && $ajax) {
        // means it was requested via Ajax
        echo json_encode(check_username($_REQUEST['username']));
        exit; // only print out the json version of the response
    } 

}

function check_username($username) {
    global $taken_usernames;
    $resp = array();
    $username = trim($username);
    if (!$username) {
        $resp = array('ok' => false, 'msg' => "Please specify a username");
    } else if (!preg_match('/^[a-z0-9\.\-_]+$/', $username)) {
        $resp = array('ok' => false, "msg" => "Your username can only contain alphanumerics and period, dash and underscore (.-_)");
    } else if (in_array($username, $taken_usernames)) {
        $resp = array("ok" => false, "msg" => "The selected username is not available");
    } else {
        $resp = array("ok" => true, "msg" => "This username is free");
    }

    return $resp;        
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
<title>iceweb08-validate.php</title>
<style type="text/css" media="screen">
<!--
body { margin: 0; padding: 10px; font: 1em "Trebuchet MS", verdana, arial, sans-serif; font-size: 100%; }
input, textarea { font-family: Arial; font-size: 125%; padding: 7px; }
label { display: block; } 
-->
</style>
</head>
<body>
<pre><code>&lt;?php

$ajax = (isset($_SERVER['HTTP_X_REQUESTED_WITH']) &amp;&amp; $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest');

$taken_usernames = array(
    'remy',
    'julie',
    'andrew',
    'andy',
    'simon',
    'chris',
    'nick'
);


if ($ajax) {
    if ($action == 'register') {
        $resp = check_username($_REQUEST['username']);

        if ($resp['ok']) {
            $message = 'All details fine';
        } else {
            $message = 'There was a problem with your registration details';
            $error = $resp;
        }
    } else if ($action == 'check_username' &amp;&amp; $ajax) {
        // means it was requested via Ajax
        echo json_encode(check_username($_REQUEST['username']));
        exit; // only print out the json version of the response
    } 

}

function check_username($username) {
    global $taken_usernames;
    $resp = array();
    $username = trim($username);
    if (!$username) {
        $resp = array('ok' => false, 'msg' => "Please specify a username");
    } else if (!preg_match('/^[a-z0-9\.\-_]+$/', $username)) {
        $resp = array('ok' => false, "msg" => "Your username can only contain alphanumerics and period, dash and underscore (.-_)");
    } else if (in_array($username, $taken_usernames)) {
        $resp = array("ok" => false, "msg" => "The selected username is not available");
    } else {
        $resp = array("ok" => true, "msg" => "This username is free");
    }

    return $resp;        
}

?&gt;
</code></pre>
</body>
</html>