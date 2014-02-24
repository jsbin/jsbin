// shows this is run through jsbin & you can edit
function jsbinShowEdit(options) {
  if (window.location.hash == '#noedit') return;
  var ie = (!+"\v1");

  function hide() {
    if (over === false) el.style.top = '-60px';
  }

  var el = document.createElement('a'),
      over = false;

  el.id = 'edit-with-js-bin';
  el.href = window.location.pathname + (window.location.pathname.substr(-1) == '/' ? '' : '/') + 'edit';

  el.innerHTML = 'Edit in JS Bin <img src="' + options.root + '/images/favicon.png">';

  var over;
  el.onmouseover = function () {
    over = true;
    this.style.top = 0;
  };

  el.onmouseout = function () {
    over = false;
    hide();
  };

  var style = document.createElement('link');
  style.setAttribute('rel', 'stylesheet');
  style.setAttribute('href', options.root + '/css/edit.css');

  var moveTimer = null;
  setTimeout(function () {
    try {
      document.getElementsByTagName('head')[0].appendChild(style);
      document.body.appendChild(el);
      setTimeout(hide, 2000);

      if (document.addEventListener) {
        document.addEventListener('mousemove', show, false);
        document.addEventListener('mouseout', function () {
          over = false;
        }, false);
      } else {
        document.attachEvent('onmousemove', show);
        document.attachEvent('onmouseout', function () {
          over = false;
        }, false);
      }
    } catch (e) {}
  }, 100);

  function show() {
    // if (!ie && (el.style.top*1) == 0) { // TODO IE compat
      el.style.top = 0;
    // } else if (ie) {
      // el.style.top = 1;
      // el.style.display = 'block';
    // }
    clearTimeout(moveTimer);
    moveTimer = setTimeout(hide, 2000);
  }
}
