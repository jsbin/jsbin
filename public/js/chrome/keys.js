/*global jsbin*/
jsbin.keys = (function () {
  /*global $document*/
  'use strict';

  // don't store the keys if they're logged in, since we have this on the server
  if (jsbin.user && jsbin.user.name) {
    return;
  }

  var keys = {};

  var find = function (url) {
    var key = keys[url || jsbin.getURL({ withRevision: true, withoutRoot: true })] || {};
    return key.c;
  };

  try {
    if ('localStorage' in window && window['localStorage'] !== null) { // jshint ignore:line

    }
  } catch(e){
    return find;
  }

  function init() {
    keys = JSON.parse(localStorage.keys || '{}');
  }

  $document.on('saved', function () {
    keys[jsbin.getURL({ withRevision: false, withoutRoot: true })] = { s: jsbin.state.revsion, c: jsbin.state.checksum, d: (new Date()).getTime() };
    localStorage.keys = JSON.stringify(keys);
  });

  // update the key lookup when a new key is stored
  window.addEventListener('storage', function (event) {
    if (event.key === 'keys') {
      init();
    }
  });

  init();

  return find;
})();