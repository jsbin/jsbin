function updateTitle(source) {
  'use strict';
  /*globals jsbin, documentTitle, $*/
  if (source === undefined) {
    source = jsbin.panels.panels.html.getCode();
  }
  // read the element out of the source code and plug it in to our document.title
  var newDocTitle = source.match(updateTitle.re);
  if (newDocTitle !== null && newDocTitle[1] !== documentTitle) {
    updateTitle.lastState = jsbin.state.latest;
    documentTitle = $('<div>').html(newDocTitle[1].trim()).text(); // jshint ignore:line
    if (documentTitle) {
      document.title = documentTitle + ' - ' + 'JS Bin';

      // add the snapshot if not the latest
    } else {
      document.title = 'JS Bin';
    }


    if (!jsbin.state.latest && jsbin.state.revision) {
      document.title = '(#' + jsbin.state.revision + ') ' + document.title;
    }
  }

  // there's an edge case here if newDocTitle === null, it won't update to show
  // the snapshot, but frankly, it's an edge case that people won't notice.

}

updateTitle.re = /<title>(.*)<\/title>/i;
updateTitle.lastState = null;