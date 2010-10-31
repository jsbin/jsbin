(function () {
forbind.debug = true;
var $stream = $('<div id="streaming"><span class="msg"></span><span class="n"></span><span class="listen"> (click here to <span class="resume">resume</span><span class="pause">pause</span>)</span></div>').prependTo('body'),
    streaming = false,
    $body = $('body'),
    key = null,
    captureTimer = null,
    last = {};

function capture() {
  var javascript = editors.javascript.getCode(),
      html = editors.html.getCode(),
      changed = false,
      msg = {};
  
  if (javascript != last.javascript) {
    msg.javascript = javascript;
    changed = true;
  }
  
  if (html != last.html) {
    msg.html = html;
    changed = true;
  }
  
  if (changed) {
    last = {
      javascript: javascript,
      html: html
    };
    
    msg.panel = getFocusedPanel();
    
    msg.line = editors[msg.panel].currentLine();
    msg.character = editors[msg.panel].cursorPosition().character;
    
    forbind.send(msg);
  }
}

forbind.on({
  join: function () {
    $body.addClass('streaming').removeClass('pausestream');
    streaming = true;
  },
  leave: function (event) {
    if (event.isme) {
      $body.addClass('pausestream');
      streaming = false;  

      $stream.one('click', function () {
        window.location.search.replace(/stream=(.+?)\b/, function (n, key) {
          window.stream.join(key);
        });
      });
    }
  },
  message: function (msg) {
    var code = msg.data;
    if (code.javascript) {
      editors.javascript.setCode(code.javascript);
    }
  
    if (code.html) {
      editors.html.setCode(code.html);
      $(document).trigger('codeChange');
    }
  
    // update preview if required
    if ($body.is('.preview')) {
      $('#preview').append('<iframe class="stretch"></iframe>');
      renderPreview();
    } else {
      var focused = editors[code.panel];
      focused.focus();
      focused.selectLines(focused.nthLine(code.line), code.character);
    
    }
  },
  error: function (data) {
    console.log('error in forbind', data);
  }
});

window.stream = {
  create: function () {
    var type, editorTimer = { javascript: null, html: null };
    
    key = (Math.abs(~~(Math.random()*+new Date))).toString(32); // OTT?
    
    var ready = function (event) {
      for (type in editors) {
        (function (type) {
          try {
            $(editors[type].win.document).bind('keyup', function () {
              if (streaming) {
                clearTimeout(editorTimer[type]);
                editorTimer[type] = setTimeout(capture, 250);              
              }
            });
          } catch (e) {}
        })(type);
      }      
    };
    
    forbind.bind('ready', ready);
    
    // this code is completely over the top - need to simplify
    $stream.find('.msg').html('streaming on <a href="/?stream=' + key + '">http://jsbin.com/?stream=' + key + '</a> to #').end().find('.n').html('0 users');
    // -1 because we're excluding counting ourselves
    forbind.bind('join leave', function (data) {
      var txt = (data.total - 1) == 1 ? ' user' : ' users';
      $stream.find('.n').html((data.total - 1) + txt);
    });
    
    forbind.create(key);
    
    $stream.removeClass('listen');

    return key;
  },
  join: function (key) {
    forbind.join(key);
    
    $stream.addClass('listen');
    
    $(document).one('keyup', function (event) {
      if (streaming && event.which == 27) {
        window.stream.leave();
      }
    });

    $stream.one('click', function () {
      window.stream.leave();
    });

    for (var type in editors) {
      try {
        $(editors[type].win.document).one('keyup', function (event) {
          if (event.which == 27) {
            window.stream.leave();
          }
        });        
      } catch (e) {
        // because it sometimes throw an error on reconnecting trying to read win.document
      }
    }
    
    $stream.find('.msg').html('following live stream...');
  },
  leave: function () {
    forbind.leave();
  }
};

window.location.search.replace(/stream=(.+?)\b/, function (n, key) {
  window.stream.join(key);
});

})();