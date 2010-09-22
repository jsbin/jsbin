(function () {

var $stream = $('<div id="streaming"><span class="msg"></span><span class="n"></span></div>').prependTo('body'),
    streaming = false,
    $body = $('body'),
    key = null,
    captureTimer = null,
    last = {};

$(document).keyup(function (event) {
  if (streaming && event.keyCode == 27) {
    window.stream.stop();
  }
});

forbind.bind('join', function () {
  $body.addClass('streaming');
  streaming = true;
}).bind('leave', function () {
  $body.removeClass('streaming');
  streaming = false;  
  clearInterval(captureTimer);
  captureTimer = null;
}).bind('message', function (msg) {
  for (var type in msg.data) {
    editors[type].setCode(msg.data[type]);
  }
  
  // update preview if required
  if ($body.is('.preview')) {
    $('#preview').append('<iframe class="stretch"></iframe>');
    renderPreview();
  }
}).bind('error', function (data) {
  console.log('error in forbind', data);
});

window.stream = {
  create: function () {
    key = (Math.abs(~~(Math.random()*+new Date))).toString(32); // OTT?
    forbind.join(key);
    
    var join = function () {
      captureTimer = setInterval(function () {
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
          forbind.send(msg);
        }
      }, 500);
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

    return key;
  },
  join: function (key) {
    forbind.unbind('create');
    forbind.join(key);
    $stream.find('.msg').html('following live stream...');
    
  },
  leave: function () {
    forbind.leave();
  }
};

window.location.search.replace(/stream=(.+?)\b/, function (n, key) {
  stream.join(key);
});

})();