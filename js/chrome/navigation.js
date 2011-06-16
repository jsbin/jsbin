// $('#startingpoint').click(function () {
//   if (localStorage) {
//     localStorage.setItem('saved-javascript', editors.javascript.getCode());
//     localStorage.setItem('saved-html', editors.html.getCode());
//     
//     // fade text out - then show "saved", then bring it back in again
//     $(this).find('span:first').fadeOut(200, function () {
//       $(this).next().fadeIn(200).animate({ foo: 1 }, 1000, function () {
//         $(this).fadeOut(200, function () {
//           $(this).prev().fadeIn(150);
//         });
//       });
//     });
//   }
//   return false;
// }).find('span').after('<span style="display: none;">Saved</span>');

var $htmlpanel = $('.code.html'),
    htmlsplitter = null;
    
function updatePanel(panel, show) {
  jsbin.settings.show[panel] = show;
  htmlsplitter = htmlsplitter || $htmlpanel.data().splitter;

  if (panel == 'live') {
    $('#live').trigger(show ? 'show' : 'hide');
    htmlsplitter.trigger('init'); // update the position of the html splitter
  } else {
    var $panel = $bin.find('.code.' + panel)[show ? 'show' : 'hide']();
    
    if (!show) {
      htmlsplitter.hide();
    } else {
      htmlsplitter.show();
    }

    var $otherpanel = panel == 'html' ? $bin.find('.code.javascript') : $bin.find('.code.html'),
        visible = $panelsvisible.filter(':not([data-panel="live"]):checked').length,
        $othercheckbox = $panelsvisible.filter('[data-panel=' + (panel == 'html' ? 'javascript' : 'html') + ']');

    // logic was only revealed by going through every possible combination. Hey, it was late :(
    if (visible === 1 && show == false) {
      // stretch
      $othercheckbox.attr('disabled', 'disabled');
      if (panel == 'html') { // only JavaScript remains
        $otherpanel.data('style', { 'right': $otherpanel.css('right') });
        $otherpanel.css('right', '0');
      } else if (panel == 'javascript') { // only HTML remains
        $otherpanel.data('style', {'left' : $otherpanel.css('left') });
        $otherpanel.css('left', '0');
      }
    } else {
      $othercheckbox.removeAttr('disabled');
      // restore CSS positions
      $otherpanel.attr('style', $otherpanel.data('style'));
    }

    if (show) {
      editors[panel].refresh();
    }

    htmlsplitter.trigger('init'); // on show or hide - recalc the splitter position    
  }
}

var $panelsvisible = $('#panelsvisible input').click(function () {
  var checked = this.checked,
      panel = $(this).data('panel');
      
  updatePanel(panel, checked);
});

var $revert = $('#revert').click(function () {
  if ($revert.is(':not(.enable)')) {
    return false;
  }
  
  sessionStorage.removeItem('javascript');
  sessionStorage.removeItem('html');

  populateEditor('javascript');
  populateEditor('html');

  editors.javascript.focus();
  $('#library').val('none');
  
  if (window.gist != undefined) {
    gist.setCode();
  }

  $(document).trigger('codeChange', [ true ]);

  return false;
});


$('#control .tab').click(function (event) {
  // event.preventDefault();
  $('body').removeClass('source preview').addClass(this.hash.substr(1));

  if ($(this).is('.preview')) {
    $('#preview iframe').remove();
    $('#preview').append('<iframe class="stretch"></iframe>');
    renderPreview();
  } else {
    // remove iframe and thus removing any (I *think*) memory resident JS
    $('#preview iframe').remove();
    editors[getFocusedPanel()].focus();
  }
});

// $('#control div.help a:last').click(function () {
//   $(window).trigger('togglehelp');
//   return false;
// });

// $('#help a:host(' + window.location.host + ')').live('click', function () {
//   $('#help #content').load(this.href + '?' + Math.random());
//   return false;    
// });

// var helpOpen = false;
// $(window).bind('togglehelp', function () {
//   var s = 100, right = helpOpen ? 0 : 300;
// 
//   if (helpOpen == false) {
//     $('#help #content').load('/help/index.html?' + Math.random());    
//   }
//   $bin.find('> div').animate({ right: right }, { duration: s });
//   $('#control').animate({ right: right }, { duration: s });
//   
//   $('#help').animate({ right: helpOpen ? -300 : 0 }, { duration: s});
//   
//   helpOpen = helpOpen ? false : true;
// });
// 
// $(document).keyup(function (event) {
//   if (helpOpen && event.keyCode == 27) {
//     $(window).trigger('togglehelp');
//   }
// });
