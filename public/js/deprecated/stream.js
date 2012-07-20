//= require "../vendor/diff_match_patch_uncompressed"

var context = this;

var script = document.createElement('script');
script.src = 'http://forbind.net/js/';
if (!($.browser.msie && $.browser.version < 8)) {
  document.body.appendChild(script);
  setTimeout(function forbindReady() {
    if (typeof window.forbind !== 'undefined') {
      forbind.apikey = '2796bc83070164231a3ab8c90227dbca';
      typeof window.console !== 'undefined' && console.log('forbind ready');
      forbindDFD.resolve(context);
    } else {
      setTimeout(forbindReady, 20);
    }
  }, 20);
}

forbindPromise.done(function (global) {
  var $stream = $('<div id="streaming"><span class="msg"></span><span class="n"></span><span class="listen"> (click here to <span class="resume">resume</span><span class="pause">pause</span>)</span></div>').prependTo('body'),
      streaming = false,
      $body = $('body'),
      key = null,
      captureTimer = null,
      last = {},
      owner = false,
      codeCastReady = false;

  $document.trigger('forbindReady');

  function changes(lang, code) {
    var msg = {},
        diff,
        patch, 
        result;
      
    if (last[lang] === undefined) {
      msg.text = code;
      msg.diff = false;
    } else {
      diff = new diff_match_patch();
      // 1. get diffs
      patch = diff.patch_make(last[lang], code);
      // 2. apply patch to old javascript
      result = diff.patch_apply(patch, last[lang]);
    
      // 3. if it matches, then send diff
      if (result[0] == code) {
        msg.text = diff.patch_toText(patch);
        msg.diff = true;
      // 4. otherwise, send entire code
      } else {
        msg.text = code;
        msg.diff = false;
      }
    }
  
    last[lang] = code;
  
    return msg;
  }

  function capture() {
    var javascript = editors.javascript.getCode(),
        html = editors.html.getCode(),
        changed = false,
        cursor,
        msg = {};
  
    msg.javascript = changes('javascript', javascript);
    msg.html = changes('html', html);

    if (msg.html.text || msg.javascript.text) {
      msg.panel = getFocusedPanel();

      cursor = editors[msg.panel].getCursor();

      msg.line = cursor.line;
      msg.ch = cursor.ch;
        
      forbind.send(msg);
    }
  }

  function initForbindForCodeCasting() {
    if (typeof window.forbind !== 'undefined' && codeCastReady == false) {
      forbind.on({
        join: function (event) {
          $body.addClass('streaming').removeClass('pausestream');
          streaming = true;

          if (event.isme && event.readonlykey) {            
            owner = true;
            sessionStorage.setItem('streamwritekey', event.readonlykey);
            sessionStorage.setItem('streamkey', key);

            // this code is completely over the top - need to simplify
            $stream.find('.msg').html('streaming on <a href="/?stream=' + key + '">http://jsbin.com/?stream=' + key + '</a> to #');

            $stream.removeClass('listen');

            $(document).bind('codeChange', throttle(capture, 250));

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
                  global.stream.join(key);
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
        message: function (event) {
          var msg = event.data;
          updateCode(msg.javascript, 'javascript');
          updateCode(msg.html, 'html');

          // update preview if required
          if ($body.is('.preview')) {
            $('#preview').remove('iframe').append('<iframe class="stretch"></iframe>');
            renderPreview();
          } else {
            var focused = editors[msg.panel];
            focused.focus();
            focused.setSelection({ line: msg.line, ch: msg.ch });
            $(document).trigger('codeChange'); // does this bubble to our send function?
          }
        },
        error: function (data) {
          console.log('error in forbind', data);
        }
      });
      codeCastReady = true;
    }
  }

  function updateCode(msg, lang) {
    var diff, patch, result, code;
  
    if (msg.text) {
      if (msg.diff) {
        diff = new diff_match_patch();
        code = editors[lang].getCode();
        var patch = diff.patch_fromText(msg.text);
        var result = diff.patch_apply(patch, code);
        editors[lang].setCode(result[0]);
      } else {
        editors[lang].setCode(msg.text);
      }    
    }
  }

  function updateCount(data) {
    if (owner) {
      var txt = (data.total - 1) == 1 ? ' user' : ' users';
      $stream.find('.n').html((data.total - 1) + txt);
    }
  }

  window.stream = global.stream = {
    create: function () {
      initForbindForCodeCasting();
      key = (Math.abs(~~(Math.random()*+new Date))).toString(32); // OTT?
        
      forbind.create(key);
    
      return key;
    },
    join: function (key) {
      initForbindForCodeCasting();
      forbind.join(key);
    
      owner = false;
      sessionStorage.removeItem('streamkey');
      sessionStorage.removeItem('streamwritekey');
    
      $stream.addClass('listen');
    
      $(document).one('keyup', function (event) {
        if (streaming && event.which == 27) {
          global.stream.leave();
        }
      });

      $stream.one('click', function () {
        global.stream.leave();
      });

      for (var type in editors) {
        try {
          $(editors[type].win.document).one('keyup', function (event) {
            if (event.which == 27) {
              global.stream.leave();
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
    global.stream.join(key);
  });

  if (sessionStorage.getItem('streamkey')) {
    key = sessionStorage.getItem('streamkey');
    forbind.join(key, sessionStorage.getItem('streamwritekey') || undefined);
  }

});