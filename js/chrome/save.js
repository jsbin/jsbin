// to allow for download button to be introduced via beta feature
$('#save').click(function (event) {
  event.preventDefault();
  saveCode('save');
  
  return false;
});

function saveCode(method) {
  // create form and post to it
  var $form = $('form')
    .append('<input type="hidden" name="javascript" />')
    .append('<input type="hidden" name="html" />');
  
  $form.find('input[name=javascript]').val(editors.javascript.getCode());
  $form.find('input[name=html]').val(editors.html.getCode());
  $form.find('input[name=method]').val(method);
  
  $form.submit();
}
