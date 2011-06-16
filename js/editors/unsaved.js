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
  if (!revert && !/\*$/.test(document.title)) {
    if (/debug/i.test(document.title)) {
      document.title = title + ' - [unsaved]';
    }
    document.title += '*';
    
    if ($revert.addClass('enable').is(':hidden')) {
      $revert[onload ? 'show' : 'fadeIn']().next().removeClass('left');
    }
  } else if (revert && /\*$/.test(document.title)) {
    document.title = document.title.replace(/\*$/, '');
  } else {
    document.title = title;
  }
}
