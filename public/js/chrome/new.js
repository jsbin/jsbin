/*global jsbin:true, analytics:true, sessionStorage:true, saveChecksum:treu*/
(function () {
"use strict";

function getTemplate(panel) {
  var saved = localStorage.getItem('saved-' + panel), // user template
      template = window.template[panel];

  return saved !== null ? saved : template;
}

function newbin() {
  var i, key;
  if (!window.history.pushState) {
    window.location = jsbin.root;
  }

  analytics.createNew();
  // FIXME this is out and out [cr]lazy....
  jsbin.panels.savecontent = function(){};
  for (i = 0; i < sessionStorage.length; i++) {
    key = sessionStorage.key(i);
    if (key.indexOf('jsbin.content.') === 0) {
      sessionStorage.removeItem(key);
    }
  }

  jsbin.panels.saveOnExit = true;

  // first try to restore their default panels
  jsbin.panels.restore();

  // if nothing was shown, show html & live
  setTimeout(function () {
    if (jsbin.panels.getVisible().length === 0) {
      jsbin.panels.panels.live.show();
      jsbin.panels.panels.html.show();
    }
  }, 0);

  var panels = 'html css javascript'.split(' '),
      length = panels.length,
      panel;

  i = 0;

  sessionStorage.removeItem('checksum');
  saveChecksum = false;

  for (panel = panels[i]; i < length; i++) {
    jsbin.panels.panels[panel].setCode(getTemplate(panel));
  }

}

})();
