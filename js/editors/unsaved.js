var $revert = $('#revert'); //.next().addClass('left').end();
$(document).bind('codeChange', function (event, revert, onload) {
  if (revert == undefined) {
    revert = false;
  } else {
    $revert.removeClass('enable');
  }
  
  updateTitle(revert, onload);
});

function updateTitle(revert, onload) {
  var title = !documentTitle ? 'JS Bin' : documentTitle;
  if (jsbin.settings.home) title = jsbin.settings.home + '@' + title;
  if (editors.html.ready && editors.javascript.ready) {
    if (!revert) {
      document.title = title + ' [unsaved]';
      if ($revert.addClass('enable').is(':hidden')) {
        $revert[onload ? 'show' : 'fadeIn']().next().removeClass('left');
      }
    } else {
      document.title = title;
    }    
  }
}
