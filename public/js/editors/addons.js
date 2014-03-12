(function () {
  'use strict';
  /*globals $, jsbin*/
  var addons = {
    closebrackets: {
      url: '/js/vendor/codemirror3/addon/edit/closebrackets.js',
      done: function (cm) {
        cm.setOption('autoCloseBrackets', true);
      }
    }
  };

  // begin loading user addons

  /**
   * TODO convert to RSVP
   */

  var $body = $('body');

  function load(url) {
    if (url.indexOf('http') !== 0) {
      url = jsbin.static + url;
    }

    if (url.slice(-3) === '.js') {
      return $.getScript(url);
    } else if (url.slice(-4) === '.css') {
      $body.append('<link href="' + url + '">');
      var d = $.Deferred();
      setTimeout(function () {
        d.resolve();
      }, 0);
      return d;
    }
  }

  Object.keys(jsbin.settings.addons || {}).forEach(function (key) {
    var addon = addons[key];
    if (addon && jsbin.settings.addons[key]) {
      if (typeof addon.url === 'string') {
        addon.url = [addon.url];
      }

      $.when.call($, addon.url.map(load)).done(function () {
        if (addon.done) {
          // WHHHHHYYYY?? because for some reason, CodeMirror hasn't attached
          // the option yet, so we wait for a tick, and then it's there.
          setTimeout(function () {
            jsbin.panels.allEditors(function (panel) {
              if (panel.editor) {
                addon.done(panel.editor);
              }
            });
          }, 0);
        }
      });
    }
  });

})();