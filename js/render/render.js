var consoleTest = /(^.|\b)console\./;

var useCustomConsole = (function () {
  var ok = window.console != undefined;
  try {
    window.console.log('jsbin init test');
  } catch (e) {
    ok = false;
  }
  return ok;
})();

function renderPreview() {
  var doc = $('#preview iframe')[0], 
      win = doc.contentDocument || doc.contentWindow.document,
      source = editors.html.getCode(),
      parts = [],
      js = editors.javascript.getCode();
   
  // redirect JS console logged to our custom log while debugging
  if (consoleTest.test(js)) {
    if (useCustomConsole) {
      js = js.replace(/(^.|\b)console\./g, '_console.');
    } else {
      js = js.replace(/(^.|\b)console\./g, 'window.top.console.');
    }
  }

  // note that I'm using split and reconcat instead of replace, because if the js var
  // contains '$$' it's replaced to '$' - thus breaking Prototype code. This method
  // gets around the problem.
  if (!$.trim(source)) {
    source = "<pre>\n" + js + "</pre>";
  } else if (/%code%/.test(source)) {
    parts = source.split('%code%');
    source = parts[0] + js + parts[1];
  } else {
    parts = source.split('</body>');
    source = parts[0] + "<script src=\"http://jsbin.com/js/render/console.js\"></script>\n<script>\ntry {\n" + js + "\n} catch (e) {" + (window.console == undefined ? '_' : 'window.top.') + "console.error(e)}\n</script>\n</body>" + parts[1];
  }

  // specific change for rendering $(document).ready() because iframes doesn't trigger ready (TODO - really test in IE, may have been fixed...)
  if (/\$\(document\)\.ready/.test(source)) {
    source = source.replace(/\$\(document\)\.ready/, 'window.onload = ');
  } 
  
  win.open();
  
  if (debug) {
    win.write('<pre>' + source.replace(/[<>&]/g, function (m) {
      if (m == '<') return '&lt;';
      if (m == '>') return '&gt;';
      if (m == '"') return '&quot;';
    }) + '</pre>');
  } else {
    win.write(source);
  }
  win.close();
}