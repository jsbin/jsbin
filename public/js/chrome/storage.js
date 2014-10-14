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

      return {
        clear: function () {
          data = {};
          window.name = '';
        },
        getItem: function (key) {
          return data[key] || null;
        },
        removeItem: function (key) {
          delete data[key];
          window.name = JSON.stringify(data);
        },
        setItem: function (key, value) {
          data[key] = value;
          window.name = JSON.stringify(data);
        }
      };
    })();
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
        content: 'JS Bin uses local data stores to maintain state, but this browser has cookies & 3rd party data disabled. Things might not work!'
      });
    });
  }

  return { polyfill: polyfill, sessionStorage: sessionStorage, localStorage: localStorage };

})();

// because: I want to hurt you firefox, that's why.
store.backup = {};

// if (hasStore('localStorage')) {
//   store.backup.localStorage = window.localStorage;
//   store.backup.sessionStorage = window.sessionStorage;
// }

// var sessionStorage = {}, localStorage = {};

// if (store.polyfill === true) {
//   window.sessionStorage = store.sessionStorage;
//   window.localStorage = store.localStorage;
// }