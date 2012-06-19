var $username = $('#username'),
    $password = $('#password'),
    $email = $('#email'),
    $loginFeedback = $('#loginFeedback');

var $loginForm = $('#login form').submit(function (event) {
  event.preventDefault();

  var name = $username.val(),
      key = $password.val(),
      email = $email.val();

  jsbin.settings.home = name; // will save later
  $loginFeedback.show().text('Checking...');

  $.ajax({
    url: jsbin.root + '/sethome',
    data: { name: name, key: key, email: email },
    type: 'post',
    dataType: 'json',
    complete: function (jqXHR) {
      var data = $.parseJSON(jqXHR.responseText) || {};
      // cookie is required to share with the server so we can do a redirect on new bin
      if (data.ok) {
        $loginFeedback.text('Successfully tied this browser to "' + name + '".');
        setTimeout(function () {
          window.location = window.location.pathname + window.location.search;
        }, 500);
      } else {
        analytics.login(false);
        $loginFeedback.text('"' + name + '" has already been taken. Please either double check the password, or choose another username.');
      }
    }
  });
});

if ($('#homebtn').length) {
  jsbin.settings.home = document.cookie.split('home=')[1].split(';')[0];
  document.title = jsbin.settings.home + '@' + document.title;
}
