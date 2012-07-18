//= require "../chrome/esc"

var $startingpoint = $('#startingpoint').click(function (event) {
  event.preventDefault();
  if (localStorage) {
    analytics.saveTemplate();
    localStorage.setItem('saved-javascript', editors.javascript.getCode());
    localStorage.setItem('saved-html', editors.html.getCode());
    $startingpoint.addClass('saved');
    $('#tip p').html('Default starting point now changed to current code');
    $html.addClass('showtip');
  }
  return false;
});

$('.disabled').on('click mousedown mouseup', function (event) {
  event.stopImmediatePropagation();
  return false;
});

$('#loginbtn').click(function () {
  analytics.login();
  // $('#login').show();
  // loginVisible = true;
  $username.focus();
  // return false;
});

$('.logout').click(function (event) {
  event.preventDefault();

  // We submit a form here because I can't work out how to style the button
  // element in the form to look the same as the anchor. Ideally we would
  // remove that and just let the form submit itself...
  $(this.hash).submit();
});

$('.homebtn').click(function () {
  analytics.open();
  jsbin.panels.hideAll();
  return false;
});

var dropdownOpen = false,
    onhover = false,
    menuDown = false;

function opendropdown(el) {
  var menu;
  if (!dropdownOpen) {
    menu = $(el).closest('.menu').addClass('open').trigger('open');
    menu.find('input:first').focus();
    dropdownOpen = el;
  }
}

function closedropdown() {
  menuDown = false;
  if (dropdownOpen) {
    dropdownButtons.closest('.menu').removeClass('open').trigger('close');
    dropdownOpen = false;
    onhover = false;
  }
}

// RS: dupe?
// $('.button-open').mousedown(function (e) {
//   if (dropdownOpen && dropdownOpen !== this) closedropdown();
//   if (!dropdownOpen) {
//     menuDown = true;
//     opendropdown(this);
//   }
//   e.preventDefault();
//   return false;
// });

var dropdownButtons = $('.button-dropdown, .button-open').mousedown(function (e) {
  $dropdownLinks.removeClass('hover');
  if (dropdownOpen && dropdownOpen !== this) closedropdown();
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
var $dropdownLinks = $('.dropdownmenu a').mouseup(function () {
  setTimeout(closedropdown, 0);
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

$('#runwithalerts').click(function () {
  renderLivePreview(true);
  return false;
});

$('#runconsole').click(function () {
  editors.console.render();
  return false;
});

$('#showhelp').click(function () {
  $body.toggleClass('keyboardHelp');
  keyboardHelpVisible = $body.is('.keyboardHelp');
  if (keyboardHelpVisible) {
    analytics.help();
  }
  return false;
});

$('#showurls').click(function () {
  $body.toggleClass('urlHelp');
  urlHelpVisible = $body.is('.urlHelp');
  if (urlHelpVisible) {
    analytics.urls();
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

$('form.login').closest('.menu').bind('close', function () {
  $(this).find('.loginFeedback').empty().hide();
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
$('form input').focus(function () {
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
  cm.setOption('onCursorActivity', function () {
    cm.setOption('onCursorActivity', null);
    mark.clear();
  });

  var mark = cm.markText(from, to, 'highlight');

  cm.focus();

  return false;
});

// add navigation to insert meta data


}());
