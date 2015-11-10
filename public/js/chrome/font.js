/** =========================================================================
 * font
 * Reads user setting and configures the CodeMirror font size
 * ========================================================================== */
/*global jsbin:true*/
var font = (function (document) {
  var head = document.getElementsByTagName('head')[0],
      selectors = '#output li, #exec, .fakeInput, .fakeInput:before, #exec:before, #bin .editbox .CodeMirror, .mobile .editbox textarea',
      size = jsbin.settings.font || 14;

  // via http://stackoverflow.com/questions/2041495/create-dynamic-inline-stylesheet
  function font(size) {
    var cssText = selectors + '{ font-size: ' + size + 'px; }',
        el = document.createElement('style');

    el.type = 'text/css';
    if (el.styleSheet) {
      el.styleSheet.cssText = cssText;//IE only
    } else {
      el.appendChild(document.createTextNode(cssText));
    }
    head.appendChild(el);
  }

  if (Object.defineProperty && jsbin.settings) {
    try {
      Object.defineProperty(jsbin.settings, 'font', {
        configurable: true,
        enumerable: true,
        get: function () {
          return size;
        },
        set: function (val) {
          size = val * 1;
          font(size);
        }
      });
    } catch (e) {
      // IE8 seems to attempt the code above, but it totally fails
    }
  }

  font(size);

  return font;
})(document);

(function () {
  'use strict';
  var md5 = 'a3a02e450f1f79f4c3482279d113b07e';
  var key = 'fonts';
  var cache;

  function insertFont(value) {
    var style = document.createElement('style');
    style.innerHTML = value;
    document.head.appendChild(style);
  }

  try {
    cache = window.localStorage.getItem(key);
    if (cache) {
      cache = JSON.parse(cache);
      if (cache.md5 === md5) {
        insertFont(cache.value);
      } else {
        // busting cache when md5 doesn't match
        window.localStorage.removeItem(key);
        cache = null;
      }
    }
  } catch (e) {
    // most likely LocalStorage disabled
    return;
  }

  if (!cache) {
    // fonts not in LocalStorage or md5 did not match
    window.addEventListener('load', function () {
      var request = new XMLHttpRequest();
      var response;
      var url = jsbin.static + '/css/fonts.a3a02e450f1f79f4c3482279d113b07e.woff.json?' + jsbin.version;
      request.open('GET', url, true);
      request.onload = function () {
        if (this.status == 200) {
          try {
            response = JSON.parse(this.response);
            insertFont(response.value);
            window.localStorage.setItem(key, this.response);
          } catch (e) {
            // localStorage is probably full
          }
        }
      };
      request.send();
    });
  }
})();