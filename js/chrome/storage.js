// I would like to lazy load json2, but I'm worried we're trying to access
// JSON very early in the code
//= require <json2>

var requiresCookies = (function () {
  var ua = navigator.userAgent.toLowerCase(),
      id = null;
  if (/mozilla/.test(ua) && !/compatible/.test(ua)) {
    id = new Date().getTime();
    document.cookie = '__cprobe=' + id + ';path=/';
    if (document.cookie.indexOf(id,0) === -1) {
      return true;
    }
  } 
  return false;
})();

// Firefox with Cookies disabled triggers a security error when we probe window.sessionStorage
// currently we're just disabling all the session features if that's the case.
var sessionStorage, localStorage;

if (!requiresCookies && window.sessionStorage) {
  sessionStorage = window.sessionStorage;
}

if (!sessionStorage) {
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

if ((!requiresCookies && !window.localStorage) || requiresCookies) {
  // dirty, but will do for our purposes
  localStorage = sessionStorage;
} else if (!requiresCookies) {
  localStorage = window.localStorage;
}