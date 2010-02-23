$('#startingpoint').click(function () {
  if (localStorage) {
    localStorage.setItem('saved-javascript', editors.javascript.getCode());
    localStorage.setItem('saved-html', editors.html.getCode());
    
    // fade text out - then show "saved", then bring it back in again
    $(this).find('span:first').fadeOut(200, function () {
      $(this).next().fadeIn(200).animate({ foo: 1 }, 1000, function () {
        $(this).fadeOut(200, function () {
          $(this).prev().fadeIn(150);
        });
      });
    });
  }
  return false;
}).find('span').after('<span style="display: none;">Saved</span>');

$('#revert').click(function () {
  var $revert = $(this);
  
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
  event.preventDefault();
  $('body').removeAttr('class').addClass(this.hash.substr(1));

  if ($(this).is('.preview')) {
    $('#preview').append('<iframe class="stretch"></iframe>');
    renderPreview();
  } else {
    // remove iframe and thus removing any (I *think*) memory resident JS
    $('#preview iframe').remove();
  }
});

$('#control div.help a:last').click(function () {
  $(window).trigger('togglehelp');
  return false;
});

$('#help a[host=' + window.location.host + ']').live('click', function () {
  $('#help #content').load(this.href);
  return false;    
});

var helpOpen = false;
$(window).bind('togglehelp', function () {
  var s = 100, right = helpOpen ? 0 : 300;

  if (helpOpen == false) {
    $('#help #content').load('/help/index.html');    
  }
  $bin.find('> div').animate({ right: right }, { duration: s });
  $('#control').animate({ right: right }, { duration: s });
  
  $('#help').animate({ right: helpOpen ? -300 : 0 }, { duration: s});
  
  helpOpen = helpOpen ? false : true;
});

$(document).keyup(function (event) {
  if (helpOpen && event.keyCode == 27) {
    $(window).trigger('togglehelp');
  }
});