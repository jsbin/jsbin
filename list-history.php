<div id="history" class="stretch">
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
<h2>Open previously saved:</h2>
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
    <td class="url"><a href="<?=$url?>edit?live"><span<?=($firstTime ? ' class="first"' : '') . '>' . $bin['url']?>/</span><?=$bin['revision']?>/</a></td>
    <td class="created"><a pubdate="<?=$bin['created']?>" href="<?=$url?>edit"><?=getRelativeTime($bin['created'])?></a></td>
    <td class="title"><a href="<?=$url?>edit?live"><?=substr($title, 0, 200)?></a></td>
  </tr>
<?php
    $last = $bin['url'];
  } 
} ?>
</tbody>
</table>
<div class="preview">
  <h2>Preview</h2>
  <p id="viewing"></p>
  <iframe id="iframe" hidden></iframe>
</div>
</div>