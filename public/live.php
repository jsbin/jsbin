<?php
include('config.php'); 
?>
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<title>Real-time live JS Bin</title>
<style>
body { margin: 0; padding: 0; overflow: hidden }
</style>
</head>
<body>
<p style="margin: 0; padding: 20px; background: #c00; color: #fff; font-weight: bold; font: 18px monospace; sans-serif;" id="debug">Waiting for connection to remote host...</p>
<script src="<?php echo ROOT ?>js/render/remote.js"></script>
</body>
</html>
