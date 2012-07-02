//= require "errors"
//= require "download"
//= require "login"
//= require "tips"

//= require "storage"
//= require "navigation"
//= require "save"
//= require "file-drop"
//= require "../render/saved-history-preview"

$(window).unload(unload);

// hack for Opera because the unload event isn't firing to capture the settings, so we put it on a timer
if ($.browser.opera) {
  setInterval(unload, 500);
}

// $('#library').chosen();

// if a gist has been requested, lazy load the gist library and plug it in
if (/gist\/\d+/.test(window.location.pathname) && (!sessionStorage.getItem('javascript') && !sessionStorage.getItem('html'))) {
  window.editors = editors; // needs to be global when the callback triggers to set the content
  loadGist = function () {
    $.getScript('/js/chrome/gist.js', function () {
      window.gist = new Gist(window.location.pathname.replace(/.*?(\d+).*/, "$1"));
    });
  };
  
  if (editors.ready) {
    loadGist();
  } else {
    editors.onReady = loadGist;
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

var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = jsbin.root + '/css/font.css?' + jsbin.version;
link.type = 'text/css';
document.getElementsByTagName('head')[0].appendChild(link);
