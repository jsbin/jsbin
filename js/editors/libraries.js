var googleajaxapi = 'http://ajax.googleapis.com/ajax/libs/',
    libraries = {
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
        version : '1.4.0',
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
    i = sources.length;

    // need to go in reverse because we're prepending the scripts, i.e. first library should be prepended first
    while (i--) {
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