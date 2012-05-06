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
    url: '/sethome',
    data: { name: name, key: key, email: email },
    type: 'post',
    dataType: 'json',
    success: function (data) {
      // cookie is required to share with the server so we can do a redirect on new bin
      if (data.ok) {
        $loginFeedback.text('Successfully tied this browser to "' + name + '".');
        setTimeout(function () {
          window.location = window.location.pathname + window.location.search;
        }, 500);
      } else {
        $loginFeedback.text('"' + name + '" has already been taken. Please either double check the password, or choose another username.');
      }
    }
  });
});

if ($('#homebtn').length) {
  jsbin.settings.home = document.cookie.split('home=')[1].split(';')[0];
  document.title = jsbin.settings.home + '@' + document.title;
}
