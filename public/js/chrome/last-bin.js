(function () {
  'use strict';

  function getExpires() {
    var d = new Date();

    // expires in 1 hour from now
    d.setTime(+d + 1000 * 60 * 60);
    return d.toUTCString();
  }

  function save() {
    var url = window.location.href;
    if (url) {
      document.cookie = 'last=' + encodeURIComponent(url) + '; expires=' + getExpires() + '; path=/';
    } else {
      // expire cookie
      document.cookie = 'last=""; expires=-1; path=/';
    }
  }

  function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  function updateBackButton() {
    var el = document.getElementById('back');
    var back = readCookie('last');

    if (el && back !== null && back !== '%2Fedit') {
      el.href = decodeURIComponent(back);
    }
  }

  // save the bin url when the bin is saved, changed and when we load first time
  if (jsbin && jsbin.getURL) {
    $document.on('saved', save);
    save();
  } else {
    updateBackButton();
  }
})();