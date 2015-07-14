/*globals objectValue, $, jsbin, $body, $document, saveChecksum, jsconsole*/
var keyboardHelpVisible = false;

var customKeys = objectValue('settings.keys', jsbin) || {};

function enableAltUse() {
  if (!jsbin.settings.keys) {
    jsbin.settings.keys = {};
  }
  jsbin.settings.keys.useAlt = this.checked;
  settings.save();
}

$('input.enablealt').attr('checked', customKeys.useAlt ? true : false).change(enableAltUse);

if (!customKeys.disabled) {
  $body.keydown(keycontrol);
} else {
  $body.addClass('nokeyboardshortcuts');
}

var panelShortcuts = {};
panelShortcuts.start = 48;
//   49: 'javascript', // 1
//   50: 'css', // 2
//   51: 'html', // 3
//   52: 'console', // 4
//   53: 'live' // 5
// };

// work out the browser platform
var ua = navigator.userAgent;
if (ua.indexOf(' Mac ') !== -1) {
  $.browser.platform = 'mac';
} else if (/windows|win32/.test(ua)) {
  $.browser.platform = 'win';
} else if (/linux/.test(ua)) {
  $.browser.platform = 'linux';
} else {
  $.browser.platform = '';
}


if (!customKeys.disabled) {
  $document.keydown(function (event) {
    var includeAltKey = customKeys.useAlt ? event.altKey : !event.altKey,
        closekey = customKeys.closePanel ? customKeys.closePanel : 48;

    if (event.ctrlKey && $.browser.platform !== 'mac') { event.metaKey = true; }

    if (event.metaKey && event.which === 89 && !event.shiftKey) {
      archive(!jsbin.state.metadata.archive);
      return event.preventDefault();
    }

    if (event.metaKey && event.which === 79) { // open
      $('a.homebtn').trigger('click', 'keyboard');
      event.preventDefault();
    } else if (event.metaKey && event.shiftKey && event.which === 8) { // cmd+shift+backspace
      $('a.deletebin:first').trigger('click', 'keyboard');
      event.preventDefault();
    } else if (!jsbin.embed && event.metaKey && event.which === 83) { // save
      if (event.shiftKey === false) {
        if (saveChecksum) {
          saveChecksum = false;
          $document.trigger('snapshot');
        } else {
          // trigger an initial save
          $('a.save:first').click();
        }
        event.preventDefault();
      } else if (event.shiftKey === true) { // shift+s = open share menu
        var $sharemenu = $('#sharemenu');
        if ($sharemenu.hasClass('open')) {

        }
        $('#sharemenu a').trigger('mousedown');
        event.preventDefault();
      }
    } else if (event.which === closekey && event.metaKey && includeAltKey && jsbin.panels.focused) {
      jsbin.panels.hide(jsbin.panels.focused.id);
    } else if (event.which === 220 && (event.metaKey || event.ctrlKey)) {
      jsbin.settings.hideheader = !jsbin.settings.hideheader;
      $body[jsbin.settings.hideheader ? 'addClass' : 'removeClass']('hideheader');
    } else if (event.which === 76 && event.ctrlKey && jsbin.panels.panels.console.visible) {
      if (event.shiftKey) {
        // reset
        jsconsole.reset();
      } else {
        // clear
        jsconsole.clear();
      }
    }
  });
}

var ignoreNextKey = false;

function keycontrol(event) {
  event = normalise(event);

  var panel = {};

  if (jsbin.panels.focused && jsbin.panels.focused.editor) {
    panel = jsbin.panels.focused.editor;
  } else if (jsbin.panels.focused) {
    panel = jsbin.panels.focused;
  }

  var codePanel = { css: 1, javascript: 1, html: 1}[panel.id],
      hasRun = false;

  var includeAltKey = customKeys.useAlt ? event.altKey : !event.altKey;

  // if (event.which === 27 && !ignoreNextKey) {
  //   ignoreNextKey = true;
  //   return;
  // } else if (ignoreNextKey && panelShortcuts[event.which] !== undefined && event.metaKey && includeAltKey) {
  //   ignoreNextKey = false;
  //   return;
  // } else if (!event.metaKey) {
  //   ignoreNextKey = false;
  // }

  // these should fire when the key goes down
  if (event.type === 'keydown') {
    if (codePanel) {
      if (event.metaKey && event.which === 13) {
        if (editors.console.visible && !editors.live.visible) {
          hasRun = true;
          // editors.console.render();
          $('#runconsole').trigger('click', 'keyboard');
        } else if (editors.live.visible) {
          // editors.live.render(true);
          $('#runwithalerts').trigger('click', 'keyboard');
          hasRun = true;
        } else {
          $('#runwithalerts').trigger('click', 'keyboard');
          hasRun = true;
        }

        if (hasRun) {
          event.stop();
        } else {
          // if we have write access - do a save - this will make this bin our latest for use with
          // /<user>/last/ - useful for phonegap inject
          sendReload();
        }
      }
    }

    // shortcut for showing a panel
    if (panelShortcuts[event.which] !== undefined && event.metaKey && includeAltKey) {
      if (jsbin.panels.focused.id === panelShortcuts[event.which]) {
        // this has been disabled in favour of:
        // if the panel is visible, and the user tries cmd+n - then the browser
        // gets the key command.
        jsbin.panels.hide(panelShortcuts[event.which]);
        event.stop();
      } else {
        // show
        jsbin.panels.show(panelShortcuts[event.which]);
        event.stop();

        if (!customKeys.useAlt && (!jsbin.settings.keys || !jsbin.settings.keys.seenWarning)) {
          var cmd = $.browser.platform === 'mac' ? 'cmd' : 'ctrl';
          if (!jsbin.settings.keys) {
            jsbin.settings.keys = {};
          }
          jsbin.settings.keys.seenWarning = true;
          $document.trigger('tip', {
            type: 'notification',
            content: '<label><input type="checkbox" class="enablealt"> <strong>Turn this off</strong>. Reserve ' + cmd + '+[n] for switching browser tabs and use ' + cmd + '+<u>alt</u>+[n] to switch JS Bin panels. You can access this any time in <strong>Help&rarr;Keyboard</strong></label>'
          });
          $('#tip').delegate('input.enablealt', 'click', function () {
            enableAltUse.call(this);
            window.location.reload();
          });
        }
      }
    }

    if (event.which === 191 && event.metaKey && event.shiftKey) {
      // show help
      opendropdown($('#help').prev()[0]);
      event.stop();
    } else if (event.which === 27 && keyboardHelpVisible) {
      $body.removeClass('keyboardHelp');
      keyboardHelpVisible = false;
      event.stop();
    } else if (event.which === 27 && jsbin.panels.focused && codePanel) {
      // event.stop();
      // return CodeMirror.commands.autocomplete(jsbin.panels.focused.editor);
    } else if (event.which === 190 && includeAltKey && event.metaKey && panel.id === 'html') {
      // auto close the element
      if (panel.somethingSelected()) {return;}
      // Find the token at the cursor
      var cur = panel.getCursor(false), token = panel.getTokenAt(cur), tprop = token;
      // If it's not a 'word-style' token, ignore the token.
      if (!/^[\w$_]*$/.test(token.string)) {
        token = tprop = {start: cur.ch, end: cur.ch, string: '', state: token.state,
                         className: token.string === '.' ? 'js-property' : null};
      }

      panel.replaceRange('</' + token.state.htmlState.context.tagName + '>', {line: cur.line, ch: token.end}, {line: cur.line, ch: token.end});
      event.stop();
    } else if (event.which === 188 && event.ctrlKey && event.shiftKey && codePanel) {
      // start a new tag
      event.stop();
      return startTagComplete(panel);
    }
  }
  // return true;

  if (event.stopping) {
    return false;
  }
}

function normalise(event) {
  var myEvent = {
    type: event.type,
    which: event.which,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    orig: event
  };

  if ( event.which === null && (event.charCode !== null || event.keyCode !== null) ) {
    myEvent.which = event.charCode !== null ? event.charCode : event.keyCode;
  }

  // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
  if ( !event.metaKey && event.ctrlKey ) {
    myEvent.metaKey = event.ctrlKey;
  }

  // this is retarded - I'm having to mess with the event just to get Firefox
  // to send through the right value. i.e. when you include a shift key modifier
  // in Firefox, if it's punctuation - event.which is zero :(
  // Note that I'm only doing this for the ? symbol + ctrl + shift
  if (event.which === 0 && event.ctrlKey === true && event.shiftKey === true && event.type === 'keydown') {
    myEvent.which = 191;
  }

  var oldStop = event.stop;
  myEvent.stop = function () {
    myEvent.stopping = true;
    if (oldStop) {oldStop.call(event);}
  };

  return myEvent;
}

