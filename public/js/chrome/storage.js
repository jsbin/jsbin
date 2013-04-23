// I would like to lazy load json2, but I'm worried we're trying to access
// JSON very early in the code
//= require <json2>

var store = (function () {
  "use strict";
  var polyfill = false;

  function hasStore(type) {
    try {
      return type in window && window[type] !== null;
    } catch(e) {
      return false;
    }
  }

  // Firefox with Cookies disabled triggers a security error when we probe window.sessionStorage
  // currently we're just disabling all the session features if that's the case.
  var sessionStorage;
  var localStorage;

  if (!hasStore('sessionStorage')) {
    polyfill = true;
    sessionStorage = (function () {
      var data = window.top.name ? JSON.parse(window.top.name) : {};

      return {
        clear: function () {
          data = {};
          window.top.name = '';
        },
        getItem: function (key) {
          return data[key] || null;
        },
        removeItem: function (key) {
          delete data[key];
          window.top.name = JSON.stringify(data);
        },
        setItem: function (key, value) {
          data[key] = value;
          window.top.name = JSON.stringify(data);
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

  return { polyfill: polyfill, sessionStorage: sessionStorage, localStorage: localStorage };

})();

var localStorage = {}, 
    sessionStorage = {};

if (store.polyfill === true) {
  sessionStorage = store.sessionStorage;
  localStorage = store.localStorage;
} else {
  delete localStorage;
  delete sessionStorage;
}