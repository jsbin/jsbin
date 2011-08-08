(function () {

var debug = false,
    iframe = null,
    key = window.location.search.replace(/\?stream=/, ''),
    console = typeof window.console !== 'undefined' ? window.console : { log: function () {} },
    $ = { trim: function (s) { return s.trim(); } },
    documentTitle = 'JS Bin: real-time remote',
    editorTemplate = function () {
      return function () {
        var code = '';
        return {
          getCode: function () {
            return code;
          },
          setCode: function (src) {
            code = src;
          }
        };
      };
    },
    editors = { javascript: editorTemplate()(), html: editorTemplate()() };

//= require "render"
//= require "../vendor/diff_match_patch_uncompressed"

if (window.top.console) window.top.console.error = notice;

function notice(msg) {
  // show the message
  console.log(msg);
}

function updateTitle() {
  document.title = documentTitle;
}

function init() {
  var script = document.createElement('script');
  script.src = 'http://forbind.net/js/';

  // if (!/msie/i.test(navigator.userAgent)) { // screw it for now - blocking IE
    document.body.appendChild(script);
    setTimeout(function forbindReady() {
      if (typeof window.forbind !== 'undefined') {
        // forbind key locked to jsbin.com
        forbind.apikey = '2796bc83070164231a3ab8c90227dbca';
        typeof window.console !== 'undefined' && console.log('forbind ready');
        initForbind();
      } else {
        setTimeout(forbindReady, 20);
      }
    }, 20);
  // }  
}

function updateCode(msg, lang) {
  var diff, patch, result, code;

  if (msg.text) {
    if (msg.diff) {
      diff = new diff_match_patch();
      code = editors[lang].getCode();
      patch = diff.patch_fromText(msg.text);
      result = diff.patch_apply(patch, code);
      editors[lang].setCode(result[0]);
    } else {
      editors[lang].setCode(msg.text);
    }    
  }
}

function initForbind() {
  // set up the event handlers
  function message(event) {
    var msg = event.data;
    
    updateCode(msg.javascript, 'javascript');
    updateCode(msg.html, 'html');
    
    var source = getPreparedCode();
    
    if (debug) {
      source = '<pre>' + source.replace(/[<>&]/g, function (m) {
        if (m == '<') return '&lt;';
        if (m == '>') return '&gt;';
        if (m == '"') return '&quot;';
      }) + '</pre>';
    }
    
    var newiframe = document.createElement('iframe');
    newiframe.border = 0;
    newiframe.frameBorder = 0;
    newiframe.style.height = '100%';
    newiframe.style.width = '100%';
    newiframe.style.position = 'absolute';
    if (iframe) document.body.insertBefore(newiframe, iframe);
    else document.body.appendChild(newiframe);
    var doc = newiframe.contentWindow.document;
    doc.open();
    doc.write(source);
    doc.close();
    
    if (iframe !== null) {
      document.body.removeChild(iframe);
    }
    
    iframe = newiframe;
    
    // document.documentElement.innerHTML = source;
    // document.open();
    //     document.write(source);
    //     document.close();
    
    notice('Updated render');
  }
  
  forbind.on({
    join: function (event) {
      if (event.isme) notice('Successfully joined');
    },
    leave: function (event) {
      if (event.isme) notice('Connection closed - window must be reloaded to attempt to reconnect');
    },
    disconnect: function () {
      notice('Connection closed - window must be reloaded to attempt to reconnect');
    },
    message: message
  });
  
  notice('Forbind ready, now joining on ' + key + '...');
  
  // now attempt to join
  forbind.debug = debug;
  forbind.join(key);
}

init();

})();