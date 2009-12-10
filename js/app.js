(function () {

var googleajaxapi = 'http://ajax.googleapis.com/ajax/libs/';
var libraries = {
  yui : {
      version : '2.7.0',
      host : googleajaxapi + 'yui',
      file : 'build/yuiloader/yuiloader-min.js'
  },
  mootools : {
      version : '1.2.3',
      host : googleajaxapi + 'mootools',
      file : 'mootools-yui-compressed.js'
  },
  prototype : {
      version : '1.6.0.3',
      host : googleajaxapi + 'prototype',
      file : 'prototype.js'
  },
  jquery : {
      version : '1.3.2',
      host : googleajaxapi + 'jquery',
      file : 'jquery.min.js'
  },
  jqueryui : {
      version : '1.7.2',
      host : googleajaxapi + 'jqueryui',
      file : 'jquery-ui.min.js',
      extra : '<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/base/jquery-ui.css" type="text/css" />'
  },
  scriptaculous : {
      version : '1.8.2', 
      host : googleajaxapi + 'scriptaculous',
      file : 'scriptaculous.js'
  },
  dojo : {
      version : '1.3.0',
      host : googleajaxapi + 'dojo',
      file : 'dojo/dojo.xd.js'
  },
  ext : {
      version: '3.0.0',
      host : googleajaxapi + 'ext-core',
      file : 'ext-core.js',
      extra : '<link rel="stylesheet" type="text/css" href="http://extjs.cachefly.net/ext-2.2/resources/css/ext-all.css" />'
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
  $('#library').val('none');

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
  var sources = [],
      state = {},
      re,
      i,
      code = editors.html.getCode();

  // strip existing libraries out
  code = code.replace(/(<script.*src=".*".*><\/script>)\n?/g, function (s, m) {
    if (m.match(/googleapis/i)) {
      return '';
    } else if (m.match(/yahooapis/i)) {
      return '';
    } else if (m.match(/jquery\-ui\.googlecode/i)) {
      return '';
    } else {
      return s;
    }
  });
  
  for (i in libraries) {
    re = new RegExp('\s+' + libraries[i].extra);
    code = code.replace(re, ''); 
  }
  
  if (this.value != 'none') {
    // to restore
    state = {
      line: editors.html.currentLine(),
      character: editors.html.cursorPosition().character
    };

    sources = this.value.split(/\+/);
    for (i = 0; i < sources.length; i++) {
      code = code.replace('<head', "<head>\n<" + 'script src="' + [libraries[sources[i]].host, libraries[sources[i]].version, libraries[sources[i]].file].join('/') + '"><' + '/script');
      if (libraries[sources[i]].extra) {
        code = code.replace('<head>', "<head>\n" + libraries[sources[i]].extra);
      }
    }
  }
  
  editors.html.setCode(code);
  editors.html.focus();
  editors.html.selectLines(editors.html.nthLine(state.line), state.character);
});

var $bin = $('#bin');
$('div.label p').click(function () {
  var speed = 500;
  if ($bin.is('.html-only')) {
    // only the html tab could have been clicked
    $bin.find('.html').animate({ left: '50%', width: '50%' }, speed);
    $bin.find('.javascript').show().animate({ left: '0%' }, speed, function () {
      $bin.removeClass('html-only');
      if (localStorage) {
        localStorage.removeItem('html-only');
      }
    });
  } else {
    $bin.find('.html').animate({ left: '00%', width: '100%' }, speed);
    $bin.find('.javascript').animate({ left: '-50%' }, speed, function () { 
      $(this).hide();
      $bin.addClass('html-only');
      // we're not reading 'true', only that it's been set
      localStorage.setItem('html-only', 'true');
    });
  }
});

/* Boot code */
if (localStorage && localStorage.getItem('html-only')) {
  $bin.addClass('html-only');
}

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

// hack for Opera because the unload event isn't firing to capture the settings, so we put it on a timer
if ($.browser.opera) {
  setInterval(function () {
    sessionStorage.setItem('javascript', editors.javascript.getCode());
    sessionStorage.setItem('html', editors.html.getCode());

    var panel = getFocusedPanel();
    sessionStorage.setItem('panel', panel);
    sessionStorage.setItem('line', editors[panel].currentLine());
    sessionStorage.setItem('character', editors[panel].cursorPosition().character);    
  }, 500);
}

function renderPreview() {
  var doc = $('#preview iframe')[0], 
      win = doc.contentDocument || doc.contentWindow.document,
      source = editors.html.getCode(),
      debug = false,
      useConsole = true;
      js = editors.javascript.getCode();
      
  // redirect JS console logged to our custom log while debugging
  if (useConsole && /(^|[^.])console/.test(js)) {
    js = js.replace(/(^|[^.])console/g, '_console');
  }
  
  if (!$.trim(source)) {
    source = "<pre>\n" + js + "</pre>";
  } else if (/%code%/.test(source)) {
    source = source.replace(/%code%/, js);
  } else { // insert before the body close tag
    source = source.replace(/<\/body>/, "<script src=\"/js/debug.js\"></script>\n<script>\ntry {\n" + js + "\n} catch (e) {_console.error(e)}\n</script>\n</body>");
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

})();















