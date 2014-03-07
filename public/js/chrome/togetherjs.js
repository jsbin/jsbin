(function () {
  /*jsbin:true */
  'use strict';

  if (window.location.hash.indexOf('togetherjs=') !== -1) {
    jsbin.saveDisabled = true;
    jsbin.sandbox = true;
    jsbin.togetherjs = true;
    console.log('togetherjs');
  }

  var name = jsbin.user ? jsbin.user.name : null;
  var avatar = jsbin.user ? jsbin.user.avatar : null;

  var TogetherJSConfig_getUserName = function () { return name; };
  var TogetherJSConfig_getUserAvatar = function () { return avatar; };
})();
