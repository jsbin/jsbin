function hasStore(type) {
  try {
    return type in window && window[type] !== null;
  } catch(e) {
    return false;
  }
}

var store = (function () {
  "use strict";
  var polyfill = false;

  // Firefox with Cookies disabled triggers a security error when we probe window.sessionStorage
  // currently we're just disabling all the session features if that's the case.
  var sessionStorage;
  var localStorage;

  if (!hasStore('sessionStorage')) {
    polyfill = true;
    sessionStorage = (function () {
      var data = window.name ? JSON.parse(window.name) : {};
      var keys = Object.keys(data);
      var length = keys.length;

      var s = {
        key: function (i) {
          return Object.keys(data)[i] || null;
        },
        length: length,
        clear: function () {
          data = {};
          window.name = '';
          s.length = 0;
        },
        getItem: function (key) {
          return data[key] || null;
        },
        removeItem: function (key) {
          delete data[key];
          window.name = JSON.stringify(data);
          s.length--;
        },
        setItem: function (key, value) {
          data[key] = value;
          window.name = JSON.stringify(data);
          s.length++;
        }
      };

      keys.forEach(function (key) {
        s[key] = data[key];
      });

      return s;
    })();
  } else {
    sessionStorage = window.sessionStorage;
  }

  if (!hasStore('localStorage')) {
    // dirty, but will do for our purposes
    localStorage = $.extend({}, sessionStorage);
  } else if (hasStore('localStorage')) {
    localStorage = window.localStorage;
  }

  if (!jsbin.embed && polyfill) {
    $(document).one('jsbinReady', function () {
      $(document).trigger('tip', {
        type: 'error',
        content: 'JS Bin uses cookies to protect against CSRF attacks, so with cookies disabled, you will not be able to save your work'
      });
    });
    jsbin.saveDisabled = true;
    jsbin.sandbox = true;
  }

  return { polyfill: polyfill, sessionStorage: sessionStorage, localStorage: localStorage };

})();

