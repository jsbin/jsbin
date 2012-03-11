<?php
function noinsert($html, $javascript) {
  if (stripos($html, 'processform.cgi') !== false) {
    return true;
  }

  if (stripos($html, 'habbo.com') !== false) {
    return true;
  }

  return false;
}
?>
