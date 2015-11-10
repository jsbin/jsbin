$('#download').click(function (event) {
  event.preventDefault();
  window.location = jsbin.getURL({ withRevision: true }) + '/download';
  analytics.download();
});
