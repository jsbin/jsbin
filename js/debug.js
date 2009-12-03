var _console = (function () {
  var body = document.getElementsByTagName('body')[0],
      holding = null;
      
  function createHolding() {
    if (!holding) {
      var el = document.createElement('div');
      el.style.backgroundColor = '#ccc';
      el.style.border = '1px solid #ccc';
      el.style.borderBottom = 'none';
      el.style.fontSize = '13px';
      el.style.fontFamily = 'helvetica, arial';
      el.style.position = 'fixed';
      el.style.bottom = '0';
      el.style.left = '0';
      el.style.width = '100%';
      el.style.maxHeight = '150px';
      el.style.overflowY = 'auto';

      body.appendChild(el);      
      holding = el;
      var con = p('<strong>Console</strong>');
      con.style.backgroundColor = '#ccc';
      con.style.padding = '5px 10px';
    }
  }
  
  function p(html, color) {
    var el = document.createElement('p');
    el.style.padding = '10px';
    el.style.margin = '1px 0';
    el.style.backgroundColor = '#FFFFD5';
    el.style.color = color || '#000';
    el.innerHTML = html;
    
    holding.appendChild(el);
    return el;
  }
  
  return {
    error: function (e) {
      var sourceEl = null;
      var line = null;
      var ua = navigator.userAgent.toLowerCase();
    
      createHolding();
      var el = p('<strong>Exception thrown:</strong> ' + e.message, '#f00');
    
      if (e.lineNumber) {
        line = e.lineNumber;
      } else if (e['opera#sourceloc']) {
        line = e['opera#sourceloc'];
      } else {
        line = e.line;
      }
      
      var oline = line;
    
      // Firefox counts 1 less
      // Safari counts 3 less
      // Opera counts from inside the body element
      if (/opera/.test(ua)) {
        sourceEl = body;
        line++;
      } else if (/webkit/.test(ua)) {
        // if the error is on the last line it confuses the debugger... :(
        sourceEl = document.getElementsByTagName('html')[0];
        line -= 4;
      } else {
        sourceEl = document.getElementsByTagName('html')[0];
        line -= 2;      
      }
    
      if (line) {
        el.innerHTML += '<br />Caused by line (' + oline + '/' + line + '): <code>' + sourceEl.innerHTML.split(/\n/)[line] + '</code>';
      }
    
      // body.appendChild(el);
    },
    log: function () {
      // window.top.console.log.apply(window.top, arguments);
      createHolding();
      p(Array.prototype.join.call(arguments, ', '), '#000');
    }
  };
})();