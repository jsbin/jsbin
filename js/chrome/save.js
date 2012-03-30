// to allow for download button to be introduced via beta feature
$('a.save').click(function (event) {
  event.preventDefault();

  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  saveCode('save', window.location.pathname.indexOf('/edit') !== -1);

  return false;
});

$('a.clone').click(function (event) {
  event.preventDefault();

  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();

  var $form = setupform('save,new');
  $form.submit();

  return false;
});

function setupform(method) {
var $form = $('form')
    .append('<input type="hidden" name="javascript" />')
    .append('<input type="hidden" name="html" />');

  $form.find('input[name=javascript]').val(editors.javascript.getCode());
  $form.find('input[name=css]').val(editors.css.getCode());
  $form.find('input[name=html]').val(editors.html.getCode());
  $form.find('input[name=method]').val(method);
  return $form;
}

function saveCode(method, ajax, ajaxCallback) {
  // create form and post to it
  var $form = setupform(method);
  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  jsbin.panels.saveOnExit = true;

  if (ajax) {
    $.ajax({
      url: $form.attr('action'),
      data: $form.serialize(),
      dataType: 'json', 
      type: 'post',
      success: function (data) {
        $('form').attr('action', data.url + '/save');
        ajaxCallback && ajaxCallback();

        if (window.history && window.history.pushState) {
          window.history.pushState(null, data.edit, data.edit);

          $('#jsbinurl').attr('href', data.url).text(data.url.replace(/http:\/\//, ''));
          updateTitle(true)
        } else {
          window.location = data.edit;
        }
      },
      error: function () {

      }
    });
  } else {
    $form.submit();
  }
}

$document.keydown(function (event) {
  if (event.metaKey && event.which == 83) {
    if (event.shiftKey == false) {
      $('#save').click();
      event.preventDefault();
    } else if (event.shiftKey == true) {
      $('.clone').click();
      event.preventDefault();
    }
  }
});