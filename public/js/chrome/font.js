/** =========================================================================
 * font
 * Reads user setting and configures the CodeMirror font size
 * ========================================================================== */
/*global jsbin:true*/
var font = (function (document) {
  var head = document.getElementsByTagName('head')[0],
      selectors = '#output li, #exec, .fakeInput, #history, .fakeInput:before, #exec:before, .editbox .CodeMirror',
      size = jsbin.settings.font || 14;

  // via http://stackoverflow.com/questions/2041495/create-dynamic-inline-stylesheet
  function font(size) {
    var cssText = selectors + '{ font-size: ' + size + 'px; }',
        el = document.createElement('style');

    el.type= 'text/css';
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