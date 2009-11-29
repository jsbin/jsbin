(function () {

var libraries = {
  jquery : {
    url: 'http://ajax.googleapis.com/ajax/libs/jquery/%version%/jquery.min.js',
    version: '1.3.2'
  }
};
  
$('#startingpoint').click(function () {
  if (localStorage) {
    localStorage.setItem('saved-javascript', editors.javascript.getCode());
    localStorage.setItem('saved-html', editors.html.getCode());
  }
  return false;
});

$('#revert').click(function () {
  sessionStorage.removeItem('javascript');
  sessionStorage.removeItem('html');

  populateEditor('javascript');
  populateEditor('html');

  editors.javascript.focus();

  return false;
});

$('#control .button').click(function (event) {
  event.preventDefault();
  $('body').removeAttr('class').addClass(this.hash.substr(1));

  if ($(this).is('.preview')) {
    renderPreview();
  } 
});

$('#library').bind('change', function () {
  var library = libraries[this.value],
      state = {},
      url;
      
  if (library) {
    // to restore
    state = {
      line: editors.html.currentLine(),
      character: editors.html.cursorPosition().character,
      code: editors.html.getCode()
    };
    
    url = library.url.replace(/%version%/, library.version);

    if (state.code.indexOf(url) === -1) {
      editors.html.setCode(state.code.replace(/<\/head>/, '  <script src="' + library.url.replace(/%version%/, library.version) + "\"></script>\n</head>"));
      editors.html.focus();
      editors.html.selectLines(editors.html.nthLine(state.line), state.character);
    }
  }
});

// $(document).bind('online', function () {
//   console.log("we're online");
// }).bind('offline', function () {
//   console.log("we're offline");
// });

// has to be first because we need to set first
$(window).unload(function () {
  sessionStorage.setItem('javascript', editors.javascript.getCode());
  sessionStorage.setItem('html', editors.html.getCode());

  var panel = getFocusedPanel();
  sessionStorage.setItem('panel', panel);
  sessionStorage.setItem('line', editors[panel].currentLine());
  sessionStorage.setItem('character', editors[panel].cursorPosition().character);    
});

function renderPreview() {
  var doc = $('#preview iframe')[0], 
      win = doc.contentDocument || doc.contentWindow.document,
      source = editors.html.getCode(),
      debug = false;
  
  if (!$.trim(source)) {
    source = "<pre>\n" + editors.javascript.getCode() + "</pre>";
  } else if (/%code%/.test(source)) {
    source = source.replace(/%code%/, editors.javascript.getCode());
  } else { // insert before the body close tag
    source = source.replace(/<\/body>/, "<script>\ntry {" + editors.javascript.getCode() + "} catch (e) {document.body.innerHTML = e.message}\n</script>\n</body>");
  }
  
  win.open();
  
  if (debug) {
    alert('<pre>' + source.replace(/<>&/g, function (m) {
      if (m == '<') return '&lt;';
      if (m == '>') return '&gt;';
      if (m == '"') return '&quot;';
    }) + '</pre>');
  } else {
    win.write(source);
  }
  win.close();
}  

})();















