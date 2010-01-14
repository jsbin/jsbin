$('#save').click(function (event) {
  event.preventDefault();
  saveCode();
  
  return false;
});

function saveCode() {
  // create form and post to it
  var $form = $('form')
    .append('<input type="hidden" name="javascript" />')
    .append('<input type="hidden" name="html" />');
  
  $form.find('input[name=javascript]').val(editors.javascript.getCode());
  $form.find('input[name=html]').val(editors.html.getCode());
  
  $form.submit();
}