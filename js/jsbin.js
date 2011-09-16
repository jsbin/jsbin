//= require <jquery>
//= require "vendor/jquery.chosen"

if (window.console === undefined) (function () {
  window.console = {
    log: function () {
      // alert([].slice.call(arguments).join('\n'));
    }
  };
})();

// required because jQuery 1.4.4 lost ability to search my object property :( (i.e. a[host=foo.com])
jQuery.expr[':'].host = function(obj, index, meta, stack) {
  return obj.host == meta[3];
};

(function (window, document, undefined) {
  //= require "chrome/storage"

  // jQuery plugins
  //= require "chrome/splitter"

  function throttle(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }
window.jsbin.settings = JSON.parse(localStorage.getItem('settings') || '{ "show": { "html": true, "javascript": true }, "theme": "jsbin" }');
//= require "vendor/json2"
//= require "editors/editors"
//= require "render/render"
//= require "chrome/beta"
//= require "chrome/app"
})(this, document);
