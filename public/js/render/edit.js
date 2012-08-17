// shows this is run through jsbin & you can edit
function jsbinShowEdit(options) {
  if (window.location.hash == '#noedit') return;
  var ie = (!+"\v1");
 
  var el = document.createElement('div'); 
  
  el.id = 'edit-with-js-bin';

  var href = window.location.pathname + (window.location.pathname.substr(-1) == '/' ? '' : '/');
  el.innerHTML = '<a href="' + href + 'edit"><img src="' + options.root + '/images/favicon.png" width="16" height="16">Edit with JS Bin</a><form method="post" action="' + href + 'report"><input type="hidden" name="email" id="abuseEmail"><button name="_csrf" value="' + options.csrf + '">Report Abuse</button></form>';
  

  var over;
  el.onmouseover = function () {
    this.style.opacity = 1;
    over = true;
  };

  el.onmouseout = function () {
    this.style.opacity = 0;
    over = false;
  };

  var getEmail = function (event) {
    var email = window.prompt("Please let us know your real email address, we'll use this to validate this is a real abuse report case - thanks!", "");
    if (email && email != '') { // TODO: Better email pattern matching
      document.getElementById('abuseEmail').value = email;
    } else {
      event.preventDefault();
      return false;
    }
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
        el.getElementsByTagName('form')[0].addEventListener('submit', getEmail, false);
      } else {
        document.attachEvent('onmousemove', show);
      }
    } catch (e) {}
  }, 100);

  function hide() {
    if (!over) el.style.opacity = 0;
  }

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
}