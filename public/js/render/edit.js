// shows this is run through jsbin & you can edit
function jsbinShowEdit(options) {
  if (window.location.hash == '#noedit') return;

  var path = window.location.pathname,
      moveTimer, active;

  function show() {
    if (active) return;
    clearTimeout(moveTimer);
    btn.style.top = '0';
    moveTimer = setTimeout(hide, 2000);
    active = true;
  }

  function hide() {
    btn.style.top = '-60px';
    active = false;
  }

  // Add edit button:
  var btn = document.createElement('a');
  btn.id = 'edit-with-js-bin';
  btn.href = path + (path.slice(-1) === '/' ? '' : '/') + 'edit';
  btn.innerHTML = 'Edit in JS Bin <img src="' + options.root + '/images/favicon.png" width="16" height="16">';
  document.body.appendChild(btn);

  // Styles for edit button:
  var style = document.createElement('link');
  style.setAttribute('rel', 'stylesheet');
  style.setAttribute('href', options.root + '/css/edit.css');
  document.getElementsByTagName('head')[0].appendChild(style);

  // hide / show edit button
  moveTimer = setTimeout(hide, 2000);
  if (document.addEventListener) document.addEventListener('mousemove', show, false);
  else document.attachEvent('onmousemove', show);
}
