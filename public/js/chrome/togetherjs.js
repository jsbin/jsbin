(function () {
  if (window.location.hash.indexOf('togetherjs=') !== -1) {
    jsbin.saveDisabled = true;
    jsbin.sandbox = true;
    jsbin.togetherjs = true;
    console.log('togetherjs init');
  }

  var name = jsbin.user ? jsbin.user.name : null;
  var avatar = jsbin.user ? jsbin.user.avatar : null;

  TogetherJSConfig_getUserName = function () { return name; };
  TogetherJSConfig_getUserAvatar = function () { return avatar; };
  // TogetherJSConfig_on_ready = function() {
  //   console.log('togetherjs ready');
  // };
  TogetherJSConfig_on_close = function () {
    console.log('togetherjs close');
    window.location.reload();
  };
})();
