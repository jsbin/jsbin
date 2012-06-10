$('#download').click(function (event) {
  event.preventDefault();
  window.location = jsbin.getURL() + '/download';
  analytics.download();
});
