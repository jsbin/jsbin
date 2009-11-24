if (!window.sessionStorage) {
  window.sessionStorage = (function () {
    var data = window.top.name ? JSON.parse(window.top.name) : {};

    return {
      setItem: function (key, value) {
        data[key] = value;
        window.top.name = JSON.stringify(data);
      },
      getItem: function (key) {
        return data[key] || undefined;
      }
    };
  })();
}