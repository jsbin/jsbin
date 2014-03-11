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

  window.TogetherJSConfig_getUserName = function () { return name; };
  window.TogetherJSConfig_getUserAvatar = function () { return avatar; };
  window.TogetherJSConfig_on_ready = function() {
    var $b = $('#togetherjs-jsbin-button');
    $b.html( $b.attr('data-end-togetherjs-html') );
    jsbin.collaborating = true;
  };
  window.TogetherJSConfig_on_close = function () {
    window.location.reload();
  };
})();
