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

$last = null;
list($dummy, $defhtml, $defjs, $defcss) = defaultCode();

$formatted = array();

arsort($order);
foreach ($order as $key => $value) {
  $template_bin = array();

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

    array_push($template_bin, array(
      'title' => substr($title, 0, 100),
      'code' => $bin['url'],
      'revision' => $bin['revision'],
      'url' => $url,
      'edit_url' => $editurl,
      'created' => $bin['created'],
      'pretty_created' => getRelativeTime($bin['created']),
      'is_first' => count($template_bin) === 0
    ));
  }
  array_push($formatted, $template_bin);
}

$view = file_get_contents('../views/history.html');
$mustache = new Mustache();
echo $mustache->render($view, array(
  'bins' => $formatted
));
