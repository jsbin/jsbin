chrome.extension.onMessage.addListener(function(code) {
  alert(JSON.stringify(code));
  var input = document.getElementsByTagName('input')[0];
  input.name = code.language;
  input.value = encodeURIComponent(code.code);
  input.form.submit();
});
