<?php if ( ! defined('ROOT')) exit('No direct script access allowed');
function plural($num) {
	if ($num != 1)
		return "s";
}

function getRelativeTime($date) {
  $time = @strtotime($date);
	$diff = time() - $time;
	if ($diff<60)
		return $diff . " second" . plural($diff) . " ago";
	$diff = round($diff/60);
	if ($diff<60)
		return $diff . " minute" . plural($diff) . " ago";
	$diff = round($diff/60);
	if ($diff<24)
		return $diff . " hour" . plural($diff) . " ago";
	$diff = round($diff/24);
	if ($diff<7)
		return $diff . " day" . plural($diff) . " ago";
	$diff = round($diff/7);
	if ($diff<4)
		return $diff . " week" . plural($diff) . " ago";
  if (date('Y', $time) != date('Y', time())) 
    return date("j-M Y", $time);
	return date("j-M", $time);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8 />
<title><?php echo $name ?>'s bins</title>
<style>
/* Font via http://robey.lag.net/2010/06/21/mensch-font.html */
@font-face {
  font-family: 'MenschRegular';
  src: url('/font/mensch-webfont.eot');
  src: url('/font/mensch-webfont.eot?#iefix') format('eot'),
       url('/font/mensch-webfont.woff') format('woff'),
       url('/font/mensch-webfont.ttf') format('truetype'),
       url('/font/mensch-webfont.svg#webfont0UwCC656') format('svg');
  font-weight: normal;
  font-style: normal;
}

body {
  font-family: MenschRegular, Menlo, Monaco, consolas, monospace;
  padding: 0;
  margin: 0;
}
.thumb {
  border: 1px solid #ccc;
  overflow: hidden;
  height: 145px;
  width: 193px;
  margin: 10px 0;
}
iframe {
  -moz-transform:    scale(0.8);
  -o-transform:      scale(0.8);
  -webkit-transform: scale(0.8);
  transform:         scale(0.8);
  /* IE8+ - must be on one line, unfortunately */ 
  -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.8, M12=0, M21=0, M22=0.8, SizingMethod='auto expand')";
  
  /* IE6 and 7 */ 
  filter: progid:DXImageTransform.Microsoft.Matrix(
           M11=0.8,
           M12=0,
           M21=0,
           M22=0.8,
           SizingMethod='auto expand');
  
  -webkit-transform-origin: 0 0;
  
  width: 100%;
  height: 100%;
}
#bins {
  width: 70%;
  font-size: 13px;
  padding: 10px 0;
  position: relative;
}
#preview {
  border-left: 1px solid #ccc;
  position: fixed;
  top: 0;
  width: 30%;
  right: 0;
  height: 100%;
  padding-top: 10px;
  background: #fff;
}
h2 {
  margin: 0;
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, Arial;
  font-size: 13px;
  padding: 0 20px;
}
#bins h2 {
  margin-bottom: 10px;
}

table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  position: relative;
}

td {
  margin: 0;
  padding: 3px 0;
}

a {
  text-decoration: none;
  color: #000;
}

.url {
  text-align: right;
  width: 25%;
  padding-left: 20px;
  padding-right: 20px;
}

.url a {
  color: #0097fe;
}

.url a span {
  color: #000;
  visibility: hidden;
}

.url span.first {
  visibility: visible;
}

.created {
  width: 25%;
}

.created a {
  color: #ccc;
}

.title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

tr:hover *,
tr.hover *,
tr:hover span,
tr.hover span {
  background: #0097fe;
  color: #fff;
  /*cursor: pointer;*/
}

tr[data-type=spacer]:hover * {
  background: #fff;
  cursor: default;
}

iframe {
  border: 0;
  display: block;
  margin: 0 auto;
  width: 90%;
}

#viewing {
  font-size: 10px;
  margin-left: 20px;
}
</style>
</head>
<body>
<div id="bins">
<h2>Open</h2>
<table>
<tbody>
<?php 
$last = null;
arsort($order);
foreach ($order as $key => $value) {
  foreach ($bins[$key] as $bin) {
    $url = formatURL($bin['url'], $bin['revision']);
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

    $firstTime = $bin['url'] != $last;

    if ($firstTime && $last !== null) : ?>
  <tr data-type="spacer"><td colspan=3></td></tr>
    <?php endif ?>
  <tr data-url="<?=$url?>">
    <td class="url"><a href="<?=$url?>edit"><span<?=($firstTime ? ' class="first"' : '') . '>' . $bin['url']?>/</span><?=$bin['revision']?>/</a></td>
    <td class="created"><a pubdate="<?=$bin['created']?>" href="<?=$url?>edit"><?=getRelativeTime($bin['created'])?></a></td>
    <td class="title"><a href="<?=$url?>edit"><?=substr($title, 0, 200)?></a></td>
  </tr>
<?php
    $last = $bin['url'];
  } 
} ?>
</tbody>
</table>
</div>
<div id="preview">
<h2>Preview</h2>
<p id="viewing"></p>
<iframe id="iframe" hidden></iframe>
</div>
<script>
function render(url) {
  iframe.src = url + 'quiet';
  iframe.removeAttribute('hidden');
  viewing.innerHTML = '<?=$_SERVER['HTTP_HOST']?>' + url;
}

function matchNode(el, nodeName) {
  if (el.nodeName == nodeName) {
    return el;
  } else if (el.nodeName == 'BODY') {
    return false;
  } else {
    return matchNode(el.parentNode, nodeName);
  }
}

function removeHighlight() {
  var i = trs.length;
  while (i--) {
    trs[i].className = '';
  }
}

function visit() {
  window.location = this.getAttribute('data-url') + 'edit';
}

var preview = document.getElementById('preview'),
    iframe = document.getElementById('iframe');
    bins = document.getElementById('bins'),
    trs = document.getElementsByTagName('tr'),
    current = null,
    viewing = document.getElementById('viewing'),
    hoverTimer = null;

// this is some nasty code - just because I couldn't be
// bothered to bring jQuery to the party.
bins.onmouseover = function (event) {
  clearTimeout(hoverTimer);
  event = event || window.event;
  var url, target = event.target || event.srcElement;
  if (target = matchNode(event.target, 'TR')) {
    removeHighlight();
    if (target.getAttribute('data-type') !== 'spacer') {
      target.className = 'hover';
      // target.onclick = visit;
      url = target.getAttribute('data-url');
      if (current !== url) {
        hoverTimer = setTimeout(function () {
          current = url;
          render(url);
        }, 200);
      }
    }
  }
};
</script>
</body>
</html>
