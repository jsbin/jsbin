//= require <jquery>
//= require "vendor/polyfills"

// var jQuery = window.jQuery,
//     $ = jQuery;

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

window['jsbin'] || (window['jsbin'] = {});
// dodgy?
var storedSettings = localStorage.getItem('settings');
window.jsbin['settings'] = $.extend(JSON.parse(storedSettings || '{}'), jsbin['settings']);


// if the above code isn't dodgy, this for hellz bells is:
jsbin.mobile = /WebKit.*Mobile.*/.test(navigator.userAgent);
jsbin.tablet = /iPad/i.test(navigator.userAgent); // sue me.

if (!storedSettings && window.location.toString() === jsbin.root + '/' ||
    (location.search.indexOf('api=') !== -1 && window.location.toString().replace(/\?api=.*$/, '') === jsbin.root + '/')) {
  // first timer - let's welcome them shall we, Dave?
  localStorage.setItem('settings', '{}');
  window.location = jsbin.root + '/welcome/130/edit?html,live'
    + (location.search.indexOf('api=') !== -1 ?  ',&' + location.search.substring(1) : '');
}

if (!jsbin.settings['codemirror']) {
  // backward compat with jsbin-v2
  jsbin.settings.codemirror = {};
} else {
  // move to editor
  jsbin.settings.editor = jsbin.settings.codemirror;
}

if (!jsbin.settings.editor) {
  jsbin.settings.editor = {};
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
    url += '/' + state.code;

    if (state.revision && state.revision !== 1) {
      url += '/' + state.revision;
    }
  }
  return url;
};

function objectValue(path, context) {
  var props = path.split('.'),
      length = props.length,
      i = 1,
      currentProp = context || window,
      value = currentProp[path];
  try {
    if (currentProp[props[0]] !== undefined) {
      currentProp = currentProp[props[0]];
      for (; i < length; i++) {
        if (typeof currentProp[props[i]] === undefined) {
          break;
        } else if (i === length - 1) {
          value = currentProp[props[i]];
        }
        currentProp = currentProp[props[i]];
      }
    }
  } catch (e) {
    value = undefined;
  }

  return value;
}


var $body = $('body'),
    $document = $(document),
    debug = jsbin.settings.debug === undefined ? false : jsbin.settings.debug,
    documentTitle = null, // null = JS Bin
    $bin = $('#bin'),
    loadGist,
    $document = $(document),
    // splitterSettings = JSON.parse(localStorage.getItem('splitterSettings') || '[ { "x" : null }, { "x" : null } ]'),
    unload = function () {
      // sessionStorage.setItem('javascript', editors.javascript.getCode());
      // sessionStorage.setItem('html', editors.html.getCode());
      sessionStorage.setItem('url', jsbin.getURL());
      localStorage.setItem('settings', JSON.stringify(jsbin.settings));

      // if (jsbin.panels.saveOnExit) ;
      jsbin.panels.save();
      jsbin.panels.savecontent();

      var panel = jsbin.panels.focused;
      if (panel) sessionStorage.setItem('panel', panel.id);
    };


if (location.search.indexOf('api=') !== -1) {
  (function () {
    var urlParts = location.search.substring(1).split(','),
        newUrlParts = [],
        i = urlParts.length,
        apiurl = '';

    while (i--) {
      if (urlParts[i].indexOf('api=') !== -1) {
        apiurl = urlParts[i].replace(/&?api=/, '');
      } else {
        newUrlParts.push(urlParts[i]);
      }
    }

    $.getScript(jsbin.root + '/js/chrome/sandbox.js', function () {
      var sandbox = new Sandbox(apiurl);
      sandbox.get('settings', function (data) {
        $.extend(jsbin.settings, data);
        window.location = location.pathname + (newUrlParts.length ? '?' + newUrlParts.join(',') : '');
      });
    });

  }());
}


$document.one('jsbinReady', function () {
  $bin.removeAttr('style');
  $body.addClass('ready');
});

//= require "vendor/json2"
//= require "editors/editors"
//= require "render/render"
// require "chrome/beta"
//= require "chrome/app"

