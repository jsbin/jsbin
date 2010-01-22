var $revert = $('#revert'); //.next().addClass('left').end();
$(document).bind('codeChange', function (event, revert) {
  if (revert == undefined) {
    revert = false;
  } else {
    $revert.removeClass('enable');
  }
  
  if (!revert && !/\*$/.test(document.title)) {
    if (/debug/i.test(document.title)) {
      document.title = 'JS Bin - [unsaved]';
    }
    document.title += '*';
    
    if ($revert.addClass('enable').is(':hidden')) {
      $revert.show().next().removeClass('left').end().fadeIn();
    }
  } else if (revert && /\*$/.test(document.title)) {
    document.title = document.title.replace(/\*$/, '');
  }
});
