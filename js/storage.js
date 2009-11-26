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