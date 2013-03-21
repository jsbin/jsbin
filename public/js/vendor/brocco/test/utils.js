var utils = {
  selectHtml: function(html, selector) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.querySelector(selector).innerHTML;
  },
  noGlobal: function(name, fn) {
    return function() {
      var tmp = window[name];
      delete window[name];
      try {
        fn();
      } finally {
        window[name] = tmp;
      }
    };
  }
};
