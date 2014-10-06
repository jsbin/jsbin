function allowDrop(holder) {
  function uploadAsset(file) {
    var s3upload = new S3Upload({
      s3_object_name: file.name.replace(/\s+/g, '-'),
      files: [file]
    });
  }


  // holder.ondragover = function () {
  //   return false;
  // };

  // holder.ondragend = function () {
  //   return false;
  // };

  var jstypes = ['javascript', 'coffeescript', 'coffee', 'js'];
  var csstypes = ['css', 'less', 'sass', 'scss'];
  var htmltypes = ['html', 'markdown', 'plain'];

  holder.ondrop = function (e) {
    e.preventDefault();


    var file = e.dataTransfer.files[0],
        reader = new FileReader();

    console.log(file);

    reader.onload = function (event) {
      // put JS in the JavaScript panel
      var type = file.type ? file.type.toLowerCase().replace(/^(text|application)\//, '') : file.name.toLowerCase().replace(/.*\./g, ''),
          panelId = null,
          panel = editors[panelId],
          syncCode = event.target.result,
          scroller = null;

      if (jstypes.indexOf(type) !== -1) {
        panelId = 'javascript';
      } else if (csstypes.indexOf(type) !== -1) {
        panelId = 'css';
      } else if (htmltypes.indexOf(type) !== -1) {
        panelId = 'html';
      }

      if (panelId === null) {
        // then we have an asset upload
        return uploadAsset(file);
      }

      panel = editors[panelId];
      scroller = panel.editor.scroller;

      panel.setCode(event.target.result);
      panel.show();

      try {
        // now kick off - basically just doing a copy and paste job from @wookiehangover - thanks man! :)
        var worker = new Worker(jsbin.root + '/js/editors/sync-worker.js');

        // pass the worker the file object
        worker.postMessage(file);

        panel.$el.find('> .label').append('<small> (live: edit & save in your fav editor)</small>');

        // bind onmessage handler
        worker.onmessage = function (event) {
          var top = scroller.scrollTop;
          panel.setCode(event.data.body);
          scroller.scrollTop = top;
          syncCode = event.data.body;
        };
      } catch (e) {
        // fail on the awesomeness...oh well
      }
    };

    reader.readAsText(file);

    return false;
  };
}

// test for dnd and file api first
if (!!(window.File && window.FileList && window.FileReader)) allowDrop(document.body);
