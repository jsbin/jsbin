try {
  console.log('Dave is ready.');
} catch (e) {
  window.console = {
    log: function () {
      // alert([].slice.call(arguments).join('\n'));
    },
    warn: function () {},
    trace: function () {},
    error: function () {}
  };
}

// required because jQuery 1.4.4 lost ability to search my object property :( (i.e. a[host=foo.com])
jQuery.expr[':'].host = function(obj, index, meta, stack) {
  return obj.host == meta[3];
};

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

function debounceAsync(fn) {
  'use strict';
  var waiting = false;
  var last = null;

  return function debouceRunner() {
    var args = [].slice.call(arguments, 0);
    // console.time('tracker');

    var tracker = function () {
      waiting = false;
        // console.timeEnd('tracker');
      if (last) {
        // console.log('applying the last');
        fn.apply(last.context, last.args);
        // console.log('and now clear');
        last = null;
      }
    };

    // put the tracker in place of the callback
    args.push(tracker);

    if (!waiting) {
      // console.log('running this time...');
      waiting = true;
      return fn.apply(this, args);
    } else {
      // console.log('going to wait...');
      last = { args: args, context: this };
    }
  };
}

function escapeHTML(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

function dedupe(array) {
  var hash    = {},
      results = [],
      hasOwn  = Object.prototype.hasOwnProperty,
      i, item, len;

  for (i = 0, len = array.length; i < len; i += 1) {
    item = array[i];

    if (!hasOwn.call(hash, item)) {
      hash[item] = 1;
      results.push(item);
    }
  }

  return results;
}

function exposeSettings() {
  'use strict';
  if (window.jsbin instanceof Node || !window.jsbin) { // because...STUPIDITY!!!
    window.jsbin = {
      'static': jsbin['static'],
      version: jsbin.version
    }; // create the holding object

    if (jsbin.state.metadata && jsbin.user && jsbin.state.metadata.name === jsbin.user.name && jsbin.user.name) {
      window.jsbin.settings = jsbin.settings;
      return;
    }

    var key = 'o' + (Math.random() * 1).toString(32).slice(2);
    Object.defineProperty(window, key, {
      get:function () {
        window.jsbin.settings = jsbin.settings;
        console.log('jsbin.settings can how be modified on the console');
      }
    });
    if (!jsbin.embed) {
      console.log('To edit settings, type this string into the console: ' + key);
    }
  }
}

var storedSettings = localStorage.getItem('settings');
if (storedSettings === "undefined") {
  // yes, equals the *string* "undefined", then something went wrong
  storedSettings = null;
}

// In all cases localStorage takes precedence over user settings so users can
// configure it from the console and overwrite the server delivered settings
jsbin.settings = $.extend({}, jsbin.settings, JSON.parse(storedSettings || '{}'));

if (jsbin.user) {
  jsbin.settings = $.extend({}, jsbin.user.settings, jsbin.settings);
}

exposeSettings();

// if the above code isn't dodgy, this for hellz bells is:
jsbin.mobile = /WebKit.*Mobile.*|Android/.test(navigator.userAgent);
jsbin.tablet = /iPad/i.test(navigator.userAgent); // sue me.
// IE detect - sadly uglify is compressing the \v1 trick to death :(
// via @padolsey & @jdalton - https://gist.github.com/527683
jsbin.ie = (function(){
  var undef,
      v = 3,
      div = document.createElement('div'),
      all = div.getElementsByTagName('i');
  while (
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
    all[0]
  );
  return v > 4 ? v : undef;
}());

if (!storedSettings && (location.origin + location.pathname) === jsbin.root + '/') {
  // first timer - let's welcome them shall we, Dave?
  localStorage.setItem('settings', '{}');
}

if (!jsbin.settings.editor) {
  // backward compat with jsbin-v2
  jsbin.settings.editor = {};
}

if (jsbin.settings.codemirror) {
  $.extend(jsbin.settings.editor, jsbin.settings.codemirror);
}

if (jsbin.settings.editor.theme) {
  $(document.documentElement).addClass('cm-s-' + jsbin.settings.editor.theme.split(' ')[0]);
}

// Add a pre-filter to all ajax requests to add a CSRF header to prevent
// malicious form submissions from other domains.
jQuery.ajaxPrefilter(function (options, original, xhr) {
  var skip = {head: 1, get: 1};
  if (!skip[options.type.toLowerCase()] &&
      !options.url.match(/^https:\/\/api.github.com/)) {
    xhr.setRequestHeader('X-CSRF-Token', jsbin.state.token);
  }
});

jsbin.owner = function () {
  return jsbin.user && jsbin.user.name && jsbin.state.metadata && jsbin.state.metadata.name === jsbin.user.name;
};

jsbin.getURL = function (withoutRoot, share) {
  var url = withoutRoot ? '' : (share ? jsbin.shareRoot : jsbin.root),
      state = jsbin.state;

  if (state.code) {
    url += '/' + state.code;

    if (state.revision) { //} && state.revision !== 1) {
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
        if (currentProp[props[i]] === undefined) {
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


var $window = $(window),
    $body = $('body'),
    $document = $(document),
    debug = jsbin.settings.debug === undefined ? false : jsbin.settings.debug,
    documentTitle = 'JS Bin',
    $bin = $('#bin'),
    loadGist,
    // splitterSettings = JSON.parse(localStorage.getItem('splitterSettings') || '[ { "x" : null }, { "x" : null } ]'),
    unload = function () {
      // sessionStorage.setItem('javascript', editors.javascript.getCode());
      if (jsbin.panels.focused.editor) {
        try { // this causes errors in IE9 - so we'll use a try/catch to get through it
          sessionStorage.setItem('line', jsbin.panels.focused.editor.getCursor().line);
          sessionStorage.setItem('character', jsbin.panels.focused.editor.getCursor().ch);
        } catch (e) {
          sessionStorage.setItem('line', 0);
          sessionStorage.setItem('character', 0);
        }
      }

      sessionStorage.setItem('url', jsbin.getURL());
      localStorage.setItem('settings', JSON.stringify(jsbin.settings));

      if (jsbin.panels.saveOnExit === false) {
        return;
      }
      jsbin.panels.save();
      jsbin.panels.savecontent();

      var panel = jsbin.panels.focused;
      if (panel) {
        sessionStorage.setItem('panel', panel.id);
      }
    };

$window.unload(unload);

// window.addEventListener('storage', function (e) {
//   if (e.storageArea === localStorage && e.key === 'settings') {
//     console.log('updating from storage');
//     console.log(JSON.parse(localStorage.settings));
//     jsbin.settings = JSON.parse(localStorage.settings);
//   }
// });

// hack for Opera because the unload event isn't firing to capture the settings, so we put it on a timer
if ($.browser.opera) {
  setInterval(unload, 500);
}

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
        unload();
        window.location = location.pathname + (newUrlParts.length ? '?' + newUrlParts.join(',') : '');
      });
    });

  }());
}


$document.one('jsbinReady', function () {
  $bin.removeAttr('style');
  $body.addClass('ready');
});

if (navigator.userAgent.indexOf(' Mac ') !== -1) (function () {
  var el = $('#keyboardHelp')[0];
  el.innerHTML = el.innerHTML.replace(/ctrl/g, 'cmd').replace(/Ctrl/g, 'ctrl');
})();

if (jsbin.embed) {
  $window.on('focus', function () {
    return false;
  });
}
