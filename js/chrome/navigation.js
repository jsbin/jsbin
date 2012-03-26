var $startingpoint = $('#startingpoint').click(function (event) {
  event.preventDefault();
  if (localStorage) {
    localStorage.setItem('saved-javascript', editors.javascript.getCode());
    localStorage.setItem('saved-html', editors.html.getCode());
    $startingpoint.addClass('saved');
    $('#tip p').html('Default starting point now changed to current code');
    $html.addClass('showtip');
  }
  return false;
});

// var $panelsvisible = $('#panelsvisible a').click(function () {
//   var self = $(this);
//   self.toggleClass('selected');

//   var selected = self.hasClass('selected'),
//       panel = self.data('panel');

//   updatePanel(panel, selected);
// });

var $panelsvisible = $('#panelsvisible'),
    currentPanels = $panelsvisible.val();

$panelsvisible.chosen().change(function () {
  var panels = ($panelsvisible.val() || []).sort(),
      current = ([].slice.apply(currentPanels)).sort(),
      selected = null,
      show = true;

  for (var i = 0; i < current.length; i++) {
    if (panels.indexOf(current[i]) !== -1) {
      panels.splice(panels.indexOf(current[i]), 1);
    } else {
      selected = current[i];
      show = false;
      break;
    }
  }

  if (!selected) {
    selected = panels.pop();
    show = true;
  }

  currentPanels = $panelsvisible.val() || [];

  updatePanel(selected, show);
});

var $htmlpanel = $('.code.html'),
    htmlsplitter = null;
    
function updatePanel(panel, show, noinit) {
  jsbin.settings.show[panel] = show;
  htmlsplitter = htmlsplitter || $('.code.html').data().splitter;

  if (panel == 'live') {
    $('#live').trigger(show ? 'show' : 'hide');
    if (!noinit) htmlsplitter && htmlsplitter.trigger('init'); // update the position of the html splitter
  } else {
    var $panel = $bin.find('.code.' + panel)[show ? 'show' : 'hide']();
    
    if (!show) {
      htmlsplitter && htmlsplitter.hide();
    } else {
      htmlsplitter && htmlsplitter.show();
    }

    var $otherpanel = panel == 'html' ? $bin.find('.code.javascript') : $bin.find('.code.html'),
        visible = currentPanels.length,
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

    if (show && editors[panel]) {
      editors[panel].refresh();
    }

    if (!noinit) htmlsplitter && htmlsplitter.trigger('init'); // on show or hide - recalc the splitter position    
  }
}

// var $panelsvisible = $('#panelsvisible input').click(function () {
//   var checked = this.checked,
//       panel = $(this).data('panel');
      
//   updatePanel(panel, checked);
// });

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
    $('#preview').append('<iframe class="stretch" frameBorder="0"></iframe>');
    renderPreview();
  } else {
    // remove iframe and thus removing any (I *think*) memory resident JS
    $('#preview iframe').remove();
    editors[getFocusedPanel()].focus();
  }
});

//= require "../chrome/esc"

var prefsOpen = false;

$('.prefsButton a').click(function (e) {
  prefsOpen = true;
  e.preventDefault();
  $body.toggleClass('prefsOpen');
});

var dropdownOpen = false;
$('.button-dropdown').click(function (e) {
  if (!dropdownOpen) {
    $(this).closest('.menu').addClass('open');
    dropdownOpen = true;
  } else {
    $(this).closest('.menu').removeClass('open');
    dropdownOpen = false;
  }
  e.preventDefault();
});

$body.click(function (event) {
  if (dropdownOpen) {
    if (!$(event.target).closest('.menu').length) {
      $('.menu.open').removeClass('open');
      dropdownOpen = false;
      return false;
    }
  }
});

$('#runwithalerts').click(function () {
  renderLivePreview(true);
});

// TODO memorise
editors.live.disablejs = jsbin.settings.disablejs;
$('#disablejs').change(function () {
  jsbin.settings.disablejs = editors.live.disablejs = this.checked;
  editors.live.render();
}).attr('checked', jsbin.settings.disablejs ? true : false);
