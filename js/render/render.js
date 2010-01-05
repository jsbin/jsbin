function renderPreview() {
  var doc = $('#preview iframe')[0], 
      win = doc.contentDocument || doc.contentWindow.document,
      source = editors.html.getCode(),
      useConsole = true;
      parts = [],
      js = editors.javascript.getCode();
   
  // redirect JS console logged to our custom log while debugging
  if (window.console != undefined) {
    js = js.replace(/(^|[^.])console/g, 'window.top.console');
  } else if (useConsole && /(^|[^.])console/.test(js)) {
    js = js.replace(/(^|[^.])console/g, '_console');
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
    source = parts[0] + "<script src=\"/js/render/console.js\"></script>\n<script>\ntry {\n" + js + "\n} catch (e) {_console.error(e)}\n</script>\n</body>" + parts[1];
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