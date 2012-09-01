// shows this is run through jsbin & you can edit
function jsbinShowEdit(options) {
  if (window.location.hash == '#noedit') return;
  var ie = (!+"\v1");
 
  function hide() {
    if (over === false) el.style.top = '-60px';
  }

  var el = document.createElement('div'),
      over = false; 
  
  el.id = 'edit-with-js-bin';

  var href = window.location.pathname + (window.location.pathname.substr(-1) == '/' ? '' : '/');

  el.innerHTML = '<div><a class="jsbin-edit" href="' + href + 'edit"><b>Edit in JS Bin</b> <img src="' + options.root + '/images/favicon.png" width="16" height="16"></a>&nbsp;<form method="post" action="' + href + 'report"><input type="hidden" name="email" id="abuseEmail"><input type="hidden" name="url" value="' + window.location.toString() + '"><button name="_csrf" title="Report Abuse" value="' + options.csrf + '">&#9873</button></form></div>';

  var over;
  el.onmouseover = function () {
    over = true;
    this.style.top = 0;
  };

  el.onmouseout = function () {
    over = false;
    hide();
  };

  var getEmail = function (event) {
    var email = window.prompt("\n** REPORT ABUSE ** \n\nPlease let us know your real email address, we'll use this to validate this is a real abuse report case - thanks!", "");
    if (email && email != '' && email.indexOf('@') !== -1) { // TODO: Better email pattern matching
      document.getElementById('abuseEmail').value = email;
    } else {
      if (event.preventDefault) event.preventDefault();
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
        document.addEventListener('mouseout', function () {
          over = false;
        }, false);
      } else {
        document.attachEvent('onmousemove', show);
        el.getElementsByTagName('form')[0].attachEvent('onsubmit', getEmail);
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