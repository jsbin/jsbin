// var $revert = $('#revert'); 

// $(document).bind('codeChange', function (event, options) { //, revert, onload) {
//   options || (options = {});

//   if (options.revert == undefined) {
//     revert = false;
//   } else {
//     $revert.removeClass('enable');
//     revert = options.revert;
//   }

//   updateTitle(revert, options.onload);
// });

function updateTitle(revert, onload) {
  var title = !documentTitle ? 'JS Bin' : documentTitle;
  if (jsbin.settings.home) title = jsbin.settings.home + '@' + title;
  if (!revert) {
    document.title = title + ' [unsaved]';
    // if ($revert.addClass('enable').is(':hidden')) {
    //   $revert[onload ? 'show' : 'fadeIn']().next().removeClass('left');
    // }
  } else {
    document.title = title;
  }
}
