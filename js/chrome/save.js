// to allow for download button to be introduced via beta feature
$('#save').click(function (event) {
  event.preventDefault();
  saveCode('save', window.location.pathname.indexOf('/edit') !== -1);
  
  return false;
});

function saveCode(method, ajax, ajaxCallback) {
  // create form and post to it
  var $form = $('form')
    .append('<input type="hidden" name="javascript" />')
    .append('<input type="hidden" name="html" />');
  
  $form.find('input[name=javascript]').val(editors.javascript.getCode());
  $form.find('input[name=html]').val(editors.html.getCode());
  $form.find('input[name=method]').val(method);
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

          $('#jsbinurl').attr('href', data.edit).text(data.edit);
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
