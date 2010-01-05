// I would like to lazy load json2, but I'm worried we're trying to access
// JSON very early in the code
//= require <json2>
if (!window.sessionStorage) {
  window.sessionStorage = (function () {
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

if (!window.localStorage) {
  // dirty, but will do for our purposes
  window.localStorage = window.sessionStorage;
}