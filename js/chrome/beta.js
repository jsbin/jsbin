// once these features are live, they come out of the jsbin beta box
(function () {  
  var $body = $('body'),
      $document = $(document),
      forbindDFD = $.Deferred(),
      forbindPromise = forbindDFD.promise();
  
  //= require "stream"  

  this.home = function (name) {
    console.log("Please note this is currently experimental - althoug I'll try, I can't guarentee this will be the way the 'home' urls will work - @rem");
    jsbin.settings.home = name; // will save later
    
    // cookie is required to share with the server so we can do a redirect on new bin
    var date = new Date();
		date.setTime(date.getTime()+(365*24*60*60*1000)); // set for a year
    document.cookie = 'home=' + name + '; expires=' + date.toGMTString() + '; path=/';
    
    if (location.pathname == '/') {
      location.reload();
    }
  };
  
  this.nojumpkeys = function () {
    
  };

  this.enableAPI = function () {
    navigator.registerProtocolHandler('web+jsbin', jsbin.root + '?api=%s', 'JS Bin API');
  };
  
  // popout live remoting
  this.popout = function () {
    var last = {};
    
    forbindPromise.done(function () {
      var key = (Math.abs(~~(Math.random()*+new Date))).toString(32);

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


      if (typeof window.forbind !== 'undefined') {
        $('a.popout').click(function () {
          if (!this.search) {

            forbind.on({
              join: function (event) {
                if (event.isme) {
                  console.log('forbind ready');
                  capture();
                } else {
                  console.log('user agent connected');
                }
                
                $document.bind('codeChange', throttle(capture, 250));
              }
            });

            this.search = '?stream=' + key;
            forbind.debug = true;
            forbind.create(key);
          }
        });
      } 
    }).fail(function () {
      console.log('Förbind is not available, therefore we can\'t start the popout. Sorry :(');
    });
  };
  
  this.diff = function (revision) {
    var url = window.location.pathname;
    url = url.split('/');
    
    var thisRev = url.pop();
    if (thisRev == 'edit') thisRev = url.pop(); // should always happen
    
    if (!revision) {
      revision = thisRev;
      revision--;
    } else {
      revision *= 1;
    }
    
    if (!isNaN(revision) && revision > 0) {
      $.ajax({
        url: url.join('/') + '/' + revision + '/source',
        dataType: 'json',
        success: function (data) {
          var diff = new diff_match_patch(),
              patch = diff.patch_make(data.javascript, editors.javascript.getCode()),
              patchText = diff.patch_toText(patch);
          
          if (patchText) {
            console.log('--- javascript diff ---');
            console.log(decodeURIComponent(patchText));
          }

          diff = new diff_match_patch();
          patch = diff.patch_make(data.html, editors.html.getCode());
          patchText = diff.patch_toText(patch);
          
          if (patchText) {
            console.log('--- html diff ---');
            console.log(decodeURIComponent(patchText));
          }
        }
      });
    } else {
      console.log('requires a revision number to test against');
    }
  };
  
  this.on = function () {
    localStorage.setItem('beta', 'true');
    $body.addClass('beta');
    this.popout();
  };
  
  this.off = function () {
    localStorage.removeItem('beta');
    $body.removeClass('beta');
  };

  this.active = localStorage.getItem('beta') == 'true' || false;
  if (this.active) this.on();
  
}).call(jsbin);
