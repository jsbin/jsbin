// once these features are live, they come out of the jsbin beta box
(function () {  
  var $body = $('body');
  
  this.on = function () {
    localStorage.setItem('beta', 'true');
    $body.addClass('beta');
  };
  
  this.off = function () {
    localStorage.removeItem('beta');
    $body.removeClass('beta');
  };

  this.active = localStorage.getItem('beta') == 'true' || false;
  if (this.active) this.on();
  
  this.home = function (name) {
    jsbin.settings.home = name; // will save later
    
    // cookie is required to share with the server so we can do a redirect on new bin
    var date = new Date();
		date.setTime(date.getTime()+(365*24*60*60*1000)); // set for a year
    document.cookie = 'home=' + name + '; expires=' + date.toGMTString() + ' path=/';
    
    if (location.pathname == '/') {
      location.reload();
    }
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
  
  //= require "stream"  
}).call(jsbin);