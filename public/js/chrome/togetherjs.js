(function () {
  /*globals jsbin, $*/
  'use strict';
  if (window.location.hash.indexOf('togetherjs=') !== -1) {
    jsbin.saveDisabled = true;
    jsbin.sandbox = true;
    jsbin.togetherjs = true;
  }

  var name = jsbin.user ? jsbin.user.name : null;
  var avatar = jsbin.user ? jsbin.user.avatar : null;

  var panelBindDone = false;

  window.TogetherJSConfig_getUserName = function () { return name; };
  window.TogetherJSConfig_getUserAvatar = function () { return avatar; };
  window.TogetherJSConfig_on_ready = function() {
    var $b = $('#togetherjs-jsbin-button');
    $b.html( $b.attr('data-end-togetherjs-html') );
    jsbin.collaborating = true;

    var restore = {};

    if (!panelBindDone) {
      jsbin.panels.allEditors(function (panel) {
        panel.editor.on('beforeChange', function codeChange(cm, changeObj) {
          if (changeObj.origin === 'setValue') {
            restore = cm.getCursor();
          }
        });

        panel.editor.on('change', function codeChange(cm, changeObj) {
          if (changeObj.origin === 'setValue') {
            cm.setCursor(restore);
          }
        });
      });
      panelBindDone = true;
    }
  };
  window.TogetherJSConfig_on_close = function () {
    window.location.reload();
  };
})();
