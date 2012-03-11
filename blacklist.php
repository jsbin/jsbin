<?php
function noinsert($html, $javascript) {
  return (stripos($html, 'processform.cgi') !== false);
}
?>
