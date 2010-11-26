(function () {
var $stream = $('<div id="streaming"><span class="msg"></span><span class="n"></span><span class="listen"> (click here to <span class="resume">resume</span><span class="pause">pause</span>)</span></div>').prependTo('body'),
    streaming = false,
    $body = $('body'),
    key = null,
    captureTimer = null,
    last = {},
    owner = false;

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
  join: function (event) {
    $body.addClass('streaming').removeClass('pausestream');
    streaming = true;
    
    if (event.isme) {
      $('#stream').fadeOut('fast').prev().addClass('right');
    }
    
    if (event.isme && event.readonlykey) {            
      owner = true;
      sessionStorage.setItem('streamwritekey', event.readonlykey);
      sessionStorage.setItem('streamkey', key);
      
      var type, editorTimer = { javascript: null, html: null };

      // this code is completely over the top - need to simplify
      $stream.find('.msg').html('streaming on <a href="/?stream=' + key + '">http://jsbin.com/?stream=' + key + '</a> to #');

      $stream.removeClass('listen');

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
      
      $(document).bind('codeChange', capture);
      
    }
    
    updateCount(event);
  },
  leave: function (event) {
    if (event.isme) {
      if (!owner) {
        $body.addClass('pausestream');
        streaming = false;  

        $stream.one('click', function () {
          window.location.search.replace(/stream=(.+?)\b/, function (n, key) {
            window.stream.join(key);
          });
        });        
      } else {
        $body.removeClass('streaming');
        owner = false;
        sessionStorage.removeItem('streamkey');
        sessionStorage.removeItem('streamwritekey');
      }
    }
    
    updateCount(event);
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

function updateCount(data) {
  if (owner) {
    var txt = (data.total - 1) == 1 ? ' user' : ' users';
    $stream.find('.n').html((data.total - 1) + txt);
  }
}

window.stream = {
  create: function () {
    key = (Math.abs(~~(Math.random()*+new Date))).toString(32); // OTT?
        
    forbind.create(key);
    
    return key;
  },
  join: function (key) {
    forbind.join(key);
    
    owner = false;
    sessionStorage.removeItem('streamkey');
    sessionStorage.removeItem('streamwritekey');
    
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

if (sessionStorage.getItem('streamkey')) {
  key = sessionStorage.getItem('streamkey');
  forbind.join(key, sessionStorage.getItem('streamwritekey') || undefined);
}

})();