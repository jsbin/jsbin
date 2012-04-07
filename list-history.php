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
<div id="history">
<h2>Open previously saved:</h2>
<table>
<tbody>
<?php 
$last = null;
arsort($order);
list($dummy, $defhtml, $defjs, $defcss) = defaultCode();
foreach ($order as $key => $value) {
  foreach ($bins[$key] as $bin) {
    $url = formatURL($bin['url'], $bin['revision']);
    $title = getTitleFromCode($bin);

    $firstTime = $bin['url'] != $last;

    // attempt to get the modified panels - note that this won't detect
    // if they're using their own template
    $args = array('?live');
    $js = trim($bin['javascript']);
    $html = trim($bin['html']);
    $css = trim($bin['css']);
    if ($js && $js !== $defjs) {
      $args[] = 'javascript';
    }
    if ($html && $html !== $defhtml) {
      $args[] = 'html';
    }
    if ($css && $css !== $defcss) {
      $args[] = 'css';
    }

    // show the console instead of the live render if there's no HTML
    if ($js && !$html) {
      $args[0] = '?console';
    }

    // TODO decide whether I need the root here...
    $editurl = $url . 'edit' . implode(',', $args);

    if ($firstTime && $last !== null) : ?>
  <tr data-type="spacer"><td colspan=3></td></tr>
    <?php endif ?>
  <tr data-url="<?=$url?>" data-edit-url="<?=$editurl?>">
    <td class="url"><a href="<?=$editurl?>"><span<?=($firstTime ? ' class="first"' : '') . '>' . $bin['url']?>/</span><?=$bin['revision']?>/</a></td>
    <td class="created"><a pubdate="<?=date('c', strtotime($bin['created']))?>" href="<?=$editurl?>"><?=getRelativeTime($bin['created'])?></a></td>
    <td class="title"><a href="<?=$editurl?>"><?=substr($title, 0, 200)?></a></td>
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