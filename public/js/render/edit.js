// shows this is run through jsbin & you can edit
(function () {
  if (window.location.hash == '#noedit') return;
  var ie = (!+"\v1");
 
  function hide() {
    el.style.opacity = 0;
  }

  var el = document.createElement('div'); 
  
  el.id = 'edit-with-js-bin';

  var href = window.location.pathname + (window.location.pathname.substr(-1) == '/' ? '' : '/');
  el.innerHTML = '<a href="' + href + '/edit"><img src="http://binarytales.local:3000/images/favicon.png">Edit with JS Bin</a><a href="report/' + href + '">Report Abuse</a>';
  
  el.onmouseover = function () {
    this.style.opacity = 1;
  };

  el.onmouseout = function () {
    this.style.opacity = 0;
  };

  var style = document.createElement('link');
  style.setAttribute('rel', 'stylesheet');
  style.setAttribute('href', '/css/edit.css');

  var moveTimer = null;
  setTimeout(function () {
    try {
      document.getElementsByTagName('head')[0].appendChild(style);
      document.body.appendChild(el);
      setTimeout(hide, 2000);

      if (document.addEventListener) {
        document.addEventListener('mousemove', show, false);
      } else {
        document.attachEvent('onmousemove', show);
      }
    } catch (e) {}
  }, 100);

  function show() {
    if (!ie && (el.style.opacity*1) == 0) { // TODO IE compat
      el.style.opacity = 1;
    } else if (ie) {
      el.style.opacity = 1;
      el.style.display = 'block';
    }
    clearTimeout(moveTimer);
    moveTimer = setTimeout(hide, 2000);
  }
})();