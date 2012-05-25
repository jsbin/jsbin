//= require <jquery>
/// require "vendor/jquery.chosen"
//= require "vendor/polyfills"

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
  //= require "chrome/analytics"
  //= require "chrome/storage"

  // jQuery plugins
  //= require "chrome/splitter"

  function throttle(fn, delay) {
    var timer = null;
    var throttled = function () {
      var context = this, args = arguments;
      throttled.cancel();
      throttled.timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };

    throttled.cancel = function () {
      clearTimeout(throttled.timer);
    };

    return throttled;
  }

  window.jsbin || (window.jsbin = {});
  // dodgy?
  var storedSettings = localStorage.getItem('settings');
  window.jsbin.settings = $.extend(JSON.parse(storedSettings || '{}'), jsbin.settings);

  if (!storedSettings) {
    console.log('first timer');
    // show them the "special" welcome
  }

  if (!jsbin.settings.codemirror) {
    // backward compat with jsbin-v2
    jsbin.settings.codemirror = {};
  }

  // Add a pre-filter to all ajax requests to add a CSRF header to prevent
  // malicious form submissions from other domains.
  jQuery.ajaxPrefilter(function (options, original, xhr) {
    var skip = {head: 1, get: 1};
    if (!skip[options.type.toLowerCase()]) {
      xhr.setRequestHeader('X-CSRF-Token', jsbin.state.token);
    }
  });

  jsbin.getURL = function () {
    var url = jsbin.root,
        state = jsbin.state;

    if (state.code) {
      url += state.code;

      if (state.revision && state.revision !== 1) {
        url += '/' + state.revision;
      }
    }
    return url;
  };

//= require "vendor/json2"
//= require "editors/editors"
//= require "render/render"
// require "chrome/beta"
//= require "chrome/app"
})(this, document);
