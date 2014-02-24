var $startingpoint = $('a.startingpoint').click(function (event) {
  event.preventDefault();
  if (localStorage) {
    analytics.saveTemplate();
    localStorage.setItem('saved-javascript', editors.javascript.getCode());
    localStorage.setItem('saved-html', editors.html.getCode());
    localStorage.setItem('saved-css', editors.css.getCode());

    $document.trigger('tip', {
      type: 'notification',
      content: 'Starting template updated and saved',
      autohide: 3000
    });
  } else {
    $document.trigger('tip', {
      type: 'error',
      content: 'Saving templates isn\'t supported in this browser I\'m afraid. Sorry'
    });
  }
  return false;
});

// if (localStorage && localStorage['saved-html']) {
  // $startingpoint.append('')
// }

$('a.disabled').on('click mousedown mouseup', function (event) {
  event.stopImmediatePropagation();
  return false;
});

$('#loginbtn').click(function () {
  analytics.login();
  $(this).toggleClass('open');
  // $('#login').show();
  // loginVisible = true;
  // return false;
});

$('a.logout').click(function (event) {
  event.preventDefault();

  // We submit a form here because I can't work out how to style the button
  // element in the form to look the same as the anchor. Ideally we would
  // remove that and just let the form submit itself...
  $(this.hash).submit();
  // Clear session storage so private bins wont be cached.
  for (i = 0; i < sessionStorage.length; i++) {
    key = sessionStorage.key(i);
    if (key.indexOf('jsbin.content.') === 0) {
      sessionStorage.removeItem(key);
    }
  }
});

$('.homebtn').click(function (event, data) {
  if (this.id === 'avatar') {
    analytics.openFromAvatar();
  } else if (this.id === 'profile') {
    analytics.openFromAvatar();
    $(this).closest('.open').removeClass('open');
  } else {
    analytics.open(data);
  }

  jsbin.panels.hideAll();
  return false;
});

var $lockrevision = $('.lockrevision').on('click', function (event) {
  event.preventDefault();
  if (!$lockrevision.data('lock')) {
    analytics.lock();
    $lockrevision.removeClass('icon-unlocked').addClass('icon-lock');
    $lockrevision.html('<span>This bin is now locked from further changes</span>');
    $lockrevision.data('locked', true);
    saveChecksum = false;
    $document.trigger('locked');
  }
  return false;
}).on('mouseup', function () {
  return false;
});

$document.on('saved', function () {
  $lockrevision.removeClass('icon-lock').addClass('icon-unlocked').data('locked', false);
  $lockrevision.html('<span>Click to lock and prevent further changes</span>');
});

$('#share input[type=text], #share textarea').on('beforecopy', function (event) {
  analytics.share('copy', this.getAttribute('data-path').substring(1) || 'output');
});

var $panelCheckboxes = $('#sharepanels input').on('change click', updateSavedState);
$('#sharemenu').bind('open', function () {
  // analytics.openShare();
  // $lockrevision.removeClass('icon-unlock').addClass('icon-lock');

  $panelCheckboxes.attr('checked', false);
  jsbin.panels.getVisible().forEach(function (panel) {
    $panelCheckboxes.filter('[data-panel="' + panel.id + '"]').attr('checked', true).change();
  });

});

var dropdownOpen = false,
    onhover = false,
    menuDown = false;

function opendropdown(el) {
  var menu;
  if (!dropdownOpen) {
    menu = $(el).closest('.menu').addClass('open').trigger('open');
    // $body.addClass('menuinfo');
    analytics.openMenu(el.hash.substring(1));
    var input = menu.find(':text:visible:first').focus()[0];
    if (input) setTimeout(function () {
      input.select();
    }, 0);
    dropdownOpen = el;
  }
}

function closedropdown() {
  menuDown = false;
  if (dropdownOpen) {
    dropdownButtons.closest('.menu').removeClass('open').trigger('close');
    // $body.removeClass('menuinfo');
    dropdownOpen = false;
    onhover = false;
  }
}

var dropdownButtons = $('.button-dropdown, .button-open').mousedown(function (e) {
  $dropdownLinks.removeClass('hover');
  if (dropdownOpen && dropdownOpen !== this) {
    closedropdown();
  }
  if (!dropdownOpen) {
    menuDown = true;
    opendropdown(this);
  }
  e.preventDefault();
  return false;
}).mouseup(function () {
  if (menuDown) return false;
}).click(function () {
  if (!menuDown) {
    analytics.closeMenu(this.hash.substring(1));
    closedropdown();
  }
  menuDown = false;
  return false;
});

$('#actionmenu').click(function () {
  dropdownOpen = true;
});

var ignoreUp = false;
$body.bind('mousedown', function (event) {
  if (dropdownOpen) {
    if ($(event.target).closest('.menu').length) {
      ignoreUp = true;
    }
  }
}).bind('click mouseup', function (event) {
  if (dropdownOpen && !ignoreUp) {
    if (!$(event.target).closest('.menu').length) {
      closedropdown();
      return false;
    }
  }
  ignoreUp = false;
});

var fromClick = false;
var $dropdownLinks = $('.dropdownmenu a, .dropdownmenu .button').mouseup(function () {
  setTimeout(closedropdown, 0);
  analytics.selectMenu(this.getAttribute('data-label') || this.hash.substring(1) || this.href);
  if (!fromClick) {
    if (this.hostname === window.location.hostname) {
      if ($(this).triggerHandler('click') !== false) {
        window.location = this.href;
      }
    } else {
      if (this.getAttribute('target')) {
        window.open(this.href);
      } else {
        window.location = this.href;
      }
    }
  }
  fromClick = false;
}).mouseover(function () {
  $dropdownLinks.removeClass('hover');
  $(this).addClass('hover');
}).mousedown(function () {
  fromClick = true;
});

$('#jsbinurl').click(function (e) {
  setTimeout(function () {
    jsbin.panels.panels.live.hide();
  }, 0);
});

$('#runwithalerts').click(function (event, data) {
  analytics.run(data);
  if (editors.console.visible) {
    editors.console.render(true);
  } else {
    renderLivePreview(true);
  }
  return false;
});

$('#runconsole').click(function () {
  analytics.runconsole();
  editors.console.render(true);
  return false;
});

$('#showhelp').click(function () {
  $body.toggleClass('keyboardHelp');
  keyboardHelpVisible = $body.is('.keyboardHelp');
  if (keyboardHelpVisible) {
    // analytics.help('keyboard');
  }
  return false;
});

$('#showurls').click(function () {
  $body.toggleClass('urlHelp');
  urlHelpVisible = $body.is('.urlHelp');
  if (urlHelpVisible) {
    // analytics.urls();
  }
  return false;
});

$('.code.panel > .label > span.name').dblclick(function () {
  jsbin.panels.allEditors(function (panel) {
    var lineNumbers = !panel.editor.getOption('lineNumbers');
    panel.editor.setOption('lineNumbers', lineNumbers);
    jsbin.settings.editor.lineNumbers = lineNumbers;
  });
});

$('#createnew').click(function () {
  var i, key;
  analytics.createNew();
  // FIXME this is out and out [cr]lazy....
  jsbin.panels.savecontent = function(){};
  for (i = 0; i < sessionStorage.length; i++) {
    key = sessionStorage.key(i);
    if (key.indexOf('jsbin.content.') === 0) {
      sessionStorage.removeItem(key);
    }
  }

  // clear out the write checksum too
  sessionStorage.removeItem('checksum');

  jsbin.panels.saveOnExit = true;

  // first try to restore their default panels
  jsbin.panels.restore();

  // if nothing was shown, show html & live
  setTimeout(function () {
    if (jsbin.panels.getVisible().length === 0) {
      jsbin.panels.panels.html.show();
      jsbin.panels.panels.live.show();
    }
  }, 0);
});

var $privateButton = $('#control a.visibilityToggle#private');
var $publicButton = $('#control a.visibilityToggle#public');

var $visibilityButtons = $('#control a.visibilityToggle').click(function(event) {
  event.preventDefault();

  var visibility = $(this).data('vis');

  $.ajax({
    url: jsbin.getURL() + '/' + visibility,
    type: 'post',
    success: function (data) {

      $document.trigger('tip', {
        type: 'notification',
        content: 'This bin is now ' + visibility,
        autohide: 6000
      });

      $visibilityButtons.css('display', 'none');

      if (visibility === 'public') {
        $privateButton.css('display', 'block');
      } else {
        $publicButton.css('display', 'block');
      }

    }
  });
});

$('form.login').closest('.menu').bind('close', function () {
  $(this).find('.loginFeedback').empty().hide();
  $('#login').removeClass('forgot');
});

$('#lostpass').click(function (e) {
  $('#login').addClass('forgot').find('input[name=email]').focus();
  return false;
});

jsbin.settings.includejs = jsbin.settings.includejs === undefined ? true : jsbin.settings.includejs;

$('#enablejs').change(function () {
  jsbin.settings.includejs = this.checked;
  analytics.enableLiveJS(jsbin.settings.includejs);
  editors.live.render();
}).attr('checked', jsbin.settings.includejs);

if (jsbin.settings.hideheader) {
  $body.addClass('hideheader');
}

var cancelUp = false;
$('form input, form textarea').focus(function () {
  this.select();
  cancelUp = true;
}).mouseup(function () {
  if (cancelUp) {
    cancelUp = false;
    return false;
  }
});

if (window.location.hash) {
  $('a[href$="' + window.location.hash + '"]').mousedown();
}

var ismac = navigator.userAgent.indexOf(' Mac ') !== -1,
    mackeys = {
      'ctrl': '⌘',
      'shift': '⇧',
      'del': '⌫'
    };

$('#control').find('a[data-shortcut]').each(function () {
  var $this = $(this),
      data = $this.data();

  var key = data.shortcut;
  if (ismac) {
    key = key.replace(/ctrl/i, mackeys.ctrl).replace(/shift/, mackeys.shift).replace(/del/, mackeys.del).replace(/\+/g, '').toUpperCase();
  }

  $this.append('<span class="keyshortcut">' + key + '</span>');
});

(function () {

var re = {
  head: /<head(.*)\n/i,
  meta: /<meta name="description".*?>/i,
  metaContent: /content=".*?"/i
};

var metatag = '<meta name="description" content="[add your bin description]" />\n';

$('#addmeta').click(function () {
  // if not - insert
  // <meta name="description" content="" />
  // if meta description is in the HTML, highlight it
  var editor = jsbin.panels.panels.html,
      cm = editor.editor,
      html = editor.getCode();

  if (!re.meta.test(html)) {
    if (re.head.test(html)) {
      html = html.replace(re.head, '<head$1\n' + metatag);
    } else {
      // slap in the top
      html = metatag + html;
    }
  }

  editor.setCode(html);

  // now select the text
  // editor.editor is the CM object...yeah, sorry about that...
  var cursor = cm.getSearchCursor(re.meta);
  cursor.findNext();

  var contentCursor = cm.getSearchCursor(re.metaContent);
  contentCursor.findNext();

  var from = { line: cursor.pos.from.line, ch: cursor.pos.from.ch + '<meta name="description" content="'.length },
      to = { line: contentCursor.pos.to.line, ch: contentCursor.pos.to.ch - 1 };

  cm.setCursor(from);
  cm.setSelection(from, to);
  cm.on('cursoractivity', function () {
    cm.on('cursoractivity', null);
    mark.clear();
  });

  var mark = cm.markText(from, to, { className: 'highlight' });

  cm.focus();

  return false;
});

$('a.deletebin').on('click', function (e) {
  e.preventDefault();
  $.ajax({
    type: 'post',
    url: jsbin.getURL() + '/delete',
    success: function () {
      jsbin.state.deleted = true;
      $document.trigger('tip', {
        type: 'error',
        content: 'This bin is now deleted. You can continue to edit, but once you leave the bin can\'t be retrieved'
      });
    },
    error: function (xhr) {
      if (xhr.status === 403) {
        $document.trigger('tip', {
          content: 'You don\'t own this bin, so you can\'t delete it.',
          autohide: 5000,
        });
      }
    }
  });
});



}());
