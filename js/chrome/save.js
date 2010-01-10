$('#save').click(function (event) {
  event.preventDefault();
  saveCode();
  return false;
});

function saveCode() {
  $.ajax({
    type: 'post',
    dataType: 'json',
    url: '/save',
    data: {
      javascript: editors.javascript.getCode(),
      html: editors.javascript.getCode()
    },
    success: function (data) {
      window.location = data.edit;
    }
  });
}