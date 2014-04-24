var binfile = (function () {
  'use strict';
  var closingScriptTag = /<\/script/ig;

  function insertBefore(output, search) {
    var parts = [];
    var close = '';
    if (output.indexOf(search) !== -1) {
      parts.push(output.substring(0, output.lastIndexOf(search)));
      parts.push(output.substring(output.lastIndexOf(search)));

      output = parts[0];
      close = parts.length === 2 && parts[1] ? parts[1] : '';

      return output;
    }
    return false;
  }

  function insertCode(output, insert, specialToken, search, joiner) {
    var parts = [];
    var close = '';
    if (output === '' && insert) {
      output = '<pre>\n' + insert.replace(/[<>&]/g, function (m) {
        if (m === '<') {return '&lt;';}
        if (m === '>') {return '&gt;';}
        if (m === '&') {return '&amp;';}
      }) + '</pre>';
    } else if (new RegExp(specialToken).test(output)) {
      parts = output.split(specialToken);
      output = parts[0] + insert + parts[1];
    } else if (insert) {
      parts = output.split(search);
      parts[0] += joiner(insert);
      output = parts.join(search);
      /*
      for (var i = 0; i < specialToken.length; i++) {
        var result = insertBefore(output, specialToken[i]);
        if (result) {
          output = result;
          break;
        }
      }

      output += joiner(insert) + close;
      */
    }

    return output;
  }

  /**
   * binfile
   *
   * Returns an HTML string reprenting the bin, requiring a minimum of the html,
   * css and js, but can also include the settings object and the original source
   * types.
   */
  function binfile(data) {
    var output = (data.html || '').trim();
    var js = (data.javascript || data.js || '').trim().replace(closingScriptTag, '<\\/script');
    var css = (data.css || '').trim();

    closingScriptTag.lastIndex = 0;

    console.log(js);
    output = insertCode(output, js, '%code%', '</body>', function () {
      // var type = jsbin.panels.panels.javascript.type ? ' type="text/' + jsbin.panels.panels.javascript.type + '"' : '';
      var type = '';
      return '<script id="jsbin-js-output" class="jsbin-js"' + type + '>' + js + '\n</script>\n';
    });

    // CSS should insert above the </head>, but if we can't find that
    // then it should go below the title, otherwise slap it in at the end
    output = insertCode(output, css, '%css%', ['</head>', '</title>'], function () {
      return '<style id="jsbin-css-output" class="jsbin-css">\n' + css + '\n</style>\n';
    });

    console.log(output);
    if (data.source) {
    
    }
    // TODO this would be a good point to trigger a filter on the completed HTML
    // that *doesn't* yet contain the source data
  }

  return binfile;

})();

if (typeof exports !== 'undefined') {
  module.exports = binfile;
}
