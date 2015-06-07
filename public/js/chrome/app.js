// if a gist has been requested, lazy load the gist library and plug it in
if (/gist\/.*/.test(window.location.pathname)) {
  window.editors = editors; // needs to be global when the callback triggers to set the content
  loadGist = function () {
    window.gist = new Gist(window.location.pathname.replace(/.*\/([^/]+)$/, "$1"));
  };

  if (editors.ready) {
    loadGist();
  } else {
    $document.on('jsbinReady', loadGist);
  }
}

// prevent the app from accidently getting scrolled out of view
if (!jsbin.mobile) document.body.onscroll = window.onscroll = function () {
  if (document.body.scrollTop !== 0) {
    window.scrollTo(0,0);
  }
  return false;
};

window.CodeMirror = CodeMirror; // fix to allow code mirror to break naturally

// These are keys that CodeMirror (and Emmet) should never take over
// ref: https://gist.github.com/rodneyrehm/5213304
if (CodeMirror.keyMap && CodeMirror.keyMap['default']) {
  var cmd = $.browser.platform === 'mac' ? 'Cmd' : 'Ctrl';
  delete CodeMirror.keyMap['default'][cmd + '-L'];
  delete CodeMirror.keyMap['default'][cmd + '-T'];
  delete CodeMirror.keyMap['default'][cmd + '-W'];
  delete CodeMirror.keyMap['default'][cmd + '-J'];
  delete CodeMirror.keyMap['default'][cmd + '-R'];
}

// var link = document.createElement('link');
// link.rel = 'stylesheet';
// link.href = jsbin['static'] + '/css/font.css?' + jsbin.version;
// link.type = 'text/css';
// document.getElementsByTagName('head')[0].appendChild(link);

if (jsbin.embed) {
  analytics.embed();
}