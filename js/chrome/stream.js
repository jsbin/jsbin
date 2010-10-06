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

forbind.bind('join', function () {
  $body.addClass('streaming').removeClass('pausestream');
  streaming = true;
}).bind('leave', function () {
  $body.addClass('pausestream');
  streaming = false;  
  
  $stream.one('click', function () {
    window.location.search.replace(/stream=(.+?)\b/, function (n, key) {
      window.stream.join(key);
    });
  });
  
}).bind('message', function (msg) {
  if (msg.javascript) {
    editors.javascript.setCode(msg.javascript);
  }
  
  if (msg.html) {
    editors.html.setCode(msg.html);
    $(document).trigger('codeChange');
  }
  
  // update preview if required
  if ($body.is('.preview')) {
    $('#preview').append('<iframe class="stretch"></iframe>');
    renderPreview();
  } else {
    var focused = editors[msg.panel];
    focused.focus();
    focused.selectLines(focused.nthLine(msg.line), msg.character);
    
  }
}).bind('error', function (data) {
  console.log('error in forbind', data);
});

window.stream = {
  create: function () {
    var type, editorTimer = { javascript: null, html: null };
    
    key = (Math.abs(~~(Math.random()*+new Date))).toString(32); // OTT?
    
    var join = function () {
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
    
    forbind.unbind('join', join).bind('join', join);
    
    // this code is completely over the top - need to simplify
    forbind.unbind('create').bind('create', function () {
      $stream.find('.msg').html('streaming on <a href="/?stream=' + key + '">http://jsbin.com/?stream=' + key + '</a> to #').end().find('.n').html('0 users');
      // -1 because we're excluding counting ourselves
      forbind.unbind('connection').bind('connection disconnection', function (data) {
        var txt = (data.total - 1) == 1 ? ' user' : ' users';
        $stream.find('.n').html((data.total - 1) + txt);
      });
    });
    
    forbind.create(key);
    
    $stream.removeClass('listen');

    return key;
  },
  join: function (key) {
    forbind.unbind('create');
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
      $(editors[type].win.document).one('keyup', function (event) {
        if (event.which == 27) {
          window.stream.leave();
        }
      });      
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