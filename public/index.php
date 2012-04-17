<?php 

include('app.php'); 

list($code_id, $revision) = getCodeIdParams($request);
$edit_mode = false;

if ($code_id) {
  list($latest_revision, $html, $javascript, $css) = getCode($code_id, $revision, true);
} else {
  list($latest_revision, $html, $javascript, $css) = defaultCode();
} 

if ($revision != 1 && $revision) {
  $code_id .= '/' . $revision;
}
$code_id_path = ROOT;
if ($code_id) {
  $code_id_path = ROOT . $code_id . '/';
}

$view = file_get_contents('../views/index.html');
$mustache = new Mustache;
echo $mustache->render($view, array(
  'root' => ROOT,
  'version' => VERSION,
  'home' => $home,
  'revision' => $revision,
  'code_id' => $code_id,
  'code_id_path' => $code_id_path,
  'json_template' => json_encode(array(
    'url' => $code_id_path . ($revision == 1 ? '' : '/' . $revision),
    'html' => $html,
    'css' => $css,
    'javascript' => $javascript
  )),
  'production?' => IN_PRODUCTION,
  'tips' => file_get_contents('tips.json')
));
?>
