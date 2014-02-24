var Gist = (function () {
  /*global $:true, jsbin:true, processors:true, $document*/
  'use strict';

  // Only allow gist import/export if CORS is supported
  var CORS = !!('withCredentials' in new XMLHttpRequest() ||
                typeof XDomainRequest !== 'undefined');
  if (!CORS) {
    return $(function () {
      $('#export-as-gist').remove();
    });
  }

  var Gist = function (id) {
    var gist = this,
        token = '';
    gist.code = {};
    if (jsbin.user && jsbin.user.github_token) { // jshint ignore:line
      token = '?access_token=' + jsbin.user.github_token; // jshint ignore:line
    }
    $.get('https://api.github.com/gists/' + id + token, function (data) {
      if (!data) {return;}
      $.each(data.files, function (fileName, fileData) {
        console.log.apply(console, [].slice.call(arguments));
        var ext = fileName.split('.').slice(-1).join('');
        gist.code[ext] = fileData.content;
      });
      gist.setCode();
    });
    return this;
  };

  Gist.prototype.setCode = function () {
    var gist = this;
    $.each(gist.code, function (ext, data) {
      var processorInit = jsbin.processors.findByExtension(ext),
          target = processorInit.target || processorInit.id,
          panel = jsbin.panels.panels[target];
      if (!panel) {return;}
      processors.set(target, processorInit.id);
      panel.setCode(data);
    });
  };

  /**
   * Export as gist
   */

  $('a.export-as-gist').click(function () {
    var gist = {
      'public': true,
      files: {}
    };
    var panels = [
      { panel: 'html' },
      { panel: 'css' },
      { panel: 'javascript', extension: 'js' }
    ];

    // Add files to gist for each panel
    panels.forEach(function (data) {
      var code;
      try {
        code = jsbin.panels.panels[data.panel].getCode();
      } catch(e) {}
      if (!code || !code.length) {return;}
      // Figure out what the file extension should be according to the processor
      var ext = data.extension || data.panel,
          processor = jsbin.panels.panels[data.panel].processor;
      if (processor && processor.extensions) {
        ext = processor.extensions[0] || processor.name;
      }
      // Build a file name
      var file = ['jsbin', (jsbin.state.code || 'untitled'), ext].join('.');
      gist.files[file] = {
        content: code
      };
    });

    var token = '';
    if (jsbin.user && jsbin.user.github_token) { // jshint ignore:line
      token = '?access_token=' + jsbin.user.github_token; // jshint ignore:line
    }

    $.ajax({
      type: 'POST',
      url: 'https://api.github.com/gists' + token,
      data: JSON.stringify(gist),
      dataType: 'json',
      crossDomain: true,
      success: function (data) {
        $document.trigger('tip', {
          type: 'notification',
          content: 'Gist created! <a href="' + data.html_url + '" target="_blank">Open in new tab.</a>' // jshint ignore:line
        });
      },
      error: function (xhr, status) {
        $document.trigger('tip', {
          type: 'error',
          content: 'Error: ' + status
        });
      }
    });
    // return false becuase there's weird even stuff going on. ask @rem.
    return false;
  });

  return Gist;

}());
