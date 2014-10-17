$('#download').click(function (event) {
  event.preventDefault();
  window.location = jsbin.getURL({ revision: true }) + '/download';
  analytics.download();
});
