// has to be first because we need to set first
$(window).unload(function () {
  sessionStorage.setItem('javascript', jseditor.getCode());
  sessionStorage.setItem('html', htmleditor.getCode());
  sessionStorage.setItem('line', jseditor.currentLine());
  sessionStorage.setItem('character', jseditor.cursorPosition().character);
});

if (!window.sessionStorage) {
  window.sessionStorage = (function () {
    var data = window.top.name ? JSON.parse(window.top.name) : {};

    $(window).unload(function () {
      window.top.name = JSON.stringify(data);
    });
    
    return {    
      setItem: function (key, value) {
        data[key] = value;
      },
      getItem: function (key) {
        return data[key] || undefined;
      }
    };
  })();
}

(function () {
  function load(n) {
    var data = sessionStorage.getItem(n);
    if (data != null) {
      document.getElementById(n).value = data;
    }
  }
  
  load('javascript');
  load('html');
})();