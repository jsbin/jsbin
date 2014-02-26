// "Edit in JS Bin" button setup
function jsbinShowEdit(options) {
  if (window.location.hash === '#noedit') return;

  var moveTimer, over,
  doc = document,
  aEL = 'addEventListener',
  path = window.location.pathname,
  style = doc.createElement('link'),
  btn = doc.createElement('a');

  // Add button:
  btn.id = 'edit-with-js-bin';
  btn.href = path + (path.slice(-1) === '/' ? '' : '/') + 'edit';
  btn.innerHTML = 'Edit in JS Bin <img src="' + options.root + '/images/favicon.png" width="16" height="16">';
  doc.body.appendChild(btn);

  // Style button:
  style.setAttribute('rel', 'stylesheet');
  style.setAttribute('href', options.root + '/css/edit.css');
  doc.getElementsByTagName('head')[0].appendChild(style);


  // show / hide button:
  btn.onmouseover = btn.onmouseout = function() {
    over = !over;
    (over ? show : hide)();
  };

  function show() {
    clearTimeout(moveTimer);
    btn.style.top = '0';
    moveTimer = setTimeout(hide, 2000);
  }

  function hide() {
    if (!over) btn.style.top = '-60px';
  }

  show();
  if (aEL in doc) doc[aEL]('mousemove', show, false);
  else doc.attachEvent('mousemove', show);
}
