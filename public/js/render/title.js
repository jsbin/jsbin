function updateTitle(source) {
  'use strict';
  /*globals jsbin, documentTitle, $*/
  if (source === undefined) {
    source = jsbin.panels.panels.html.getCode();
  }
  // read the element out of the source code and plug it in to our document.title
  var newDocTitle = source.match(updateTitle.re);
  if ((updateTitle.lastState !== jsbin.state.latest) || newDocTitle !== null && newDocTitle[1] !== documentTitle) {
    updateTitle.lastState = jsbin.state.latest;
    documentTitle = $('<div>').html(newDocTitle[1].trim()).text(); // jshint ignore:line
    if (documentTitle) {
      document.title = documentTitle + ' - ' + 'JS Bin';

      // add the snapshot if not the latest
      if (!jsbin.state.latest) {
        document.title = '(#' + jsbin.state.revision + ') ' + document.title;
      }
    } else {
      document.title = 'JS Bin';
    }
  }
}

updateTitle.re = /<title>(.*)<\/title>/i;
updateTitle.lastState = null;