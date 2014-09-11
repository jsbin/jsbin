var Gist = (function () { // jshint ignore:line
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
      jsbin.saveDisabled = true;
      panel.setCode(data);
      jsbin.saveDisabled = false;
    });
  };

  /**
   * Export as gist
   */

  $('a.export-as-gist').click(function () {
    var gist = {
      public: true,
      files: {}
    };

    var panels = {
      html: jsbin.panels.panels.html.render(),
      javascript: jsbin.panels.panels.javascript.render(),
      css: jsbin.panels.panels.css.render()
    };

    RSVP.hash(panels).then(function (panels) {
      // Build a file name
      Object.keys(panels).forEach(function (key) {
        var ext = processors[key].extensions ? processors[key].extensions[0] : key;
        var file = ['jsbin', (jsbin.state.code || 'untitled'), ext].join('.');
        if (panels[key].length) {
          gist.files[file] = {
            content: panels[key]
          };
        }
      });

      if (!gist.files.javascript && !gist.files.css) {
        delete gist.files[['jsbin', (jsbin.state.code || 'untitled'), 'html'].join('.')]
      }

      if (jsbin.state.processors) {
        panels.source = jsbin.state.processors;
        Object.keys(panels.source).forEach(function (key) {
          panels.source[key] = jsbin.panels.panels[key].getCode();
        });
      }

      var index = binToFile(panels);

      gist.files['index.html'] = {
        content: index
      };

      var desc = [];

      if (jsbin.state.title) {
        desc.push(jsbin.state.title);
      }

      if (jsbin.state.description) {
        desc.push(jsbin.state.description);
      }

      desc.push('// source ' + jsbin.getURL());

      gist.description = desc.join('\n\n');

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
        error: function (xhr, status, error) {
          $document.trigger('tip', {
            type: 'error',
            content: 'There was a problem creating the gist: ' + error
          });
          console.group('gist');
          console.log(gist);
          console.groupEnd('gist');
        }
      });
    }, function (error) {
      console.error(error.stack);
    });

    // return false becuase there's weird even stuff going on. ask @rem.
    return false;
  });

  return Gist;

}());
