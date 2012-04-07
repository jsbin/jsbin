//= require "autocomplete"
//= require "../chrome/esc"

var keyboardHelpVisible = false;

$body.keydown(keycontrol);

var panelShortcuts = {
  49: 'javascript', // 1
  50: 'css', // 2
  51: 'html', // 3
  52: 'console', // 4
  53: 'live' // 5
};

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

  // these should fire when the key goes down
  if (event.type == 'keydown') {
    if (codePanel) {
      if (event.metaKey && event.which == 13) {
        if (editors.console.visible) {
          hasRun = true;
          editors.console.render();
        }
        if (editors.live.visible) {
          renderLivePreview(true);
          hasRun = true;
        }

        if (hasRun) {
          event.stop();
        }
      }
    }

    // shortcut for showing a panel

    if (panelShortcuts[event.which] !== undefined && event.metaKey) {
      jsbin.panels.show(panelShortcuts[event.which]);
      event.stop();
    } else if (event.which === 192 && event.metaKey && jsbin.panels.focused) {
      jsbin.panels.focused.hide();
      var visible = jsbin.panels.getVisible();
      if (visible.length) {
        jsbin.panels.focused = visible[0];
        if (visible[0].editor) {
          visible[0].editor.focus();
        } else {
          visible[0].$el.focus();
        }
      }
    }

    if (event.which == 191 && event.shiftKey && event.metaKey) {
      // show help
      $body.toggleClass('keyboardHelp');
      keyboardHelpVisible = $body.is('.keyboardHelp');
      event.stop();
    } else if (event.which == 76 && event.shiftKey && event.metaKey) {
      if (!editors.live.visible) {
        editors.live.show();
      }
      $('#runwithalerts').click();
      event.stop();
    } else if (event.which == 27 && keyboardHelpVisible) {
      $body.removeClass('keyboardHelp');
      keyboardHelpVisible = false;
      event.stop();
    } else if (event.which == 27) {
      event.stop();
      return startComplete(panel);
    } else if (event.which == 190 && event.altKey && event.metaKey && panel.id == 'html') {
      // auto close the element
      if (panel.somethingSelected()) return;
      // Find the token at the cursor
      var cur = panel.getCursor(false), token = panel.getTokenAt(cur), tprop = token;
      // If it's not a 'word-style' token, ignore the token.
      if (!/^[\w$_]*$/.test(token.string)) {
        token = tprop = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                         className: token.string == "." ? "js-property" : null};
      }
    
      panel.replaceRange('</' + token.state.htmlState.context.tagName + '>', {line: cur.line, ch: token.end}, {line: cur.line, ch: token.end});
      event.stop();
    } else if (event.which == 188 && event.ctrlKey && event.shiftKey && codePanel) {
      // start a new tag
      event.stop();
      return startTagComplete(panel);
    } else if (event.which == 191 && event.metaKey && codePanel) {
      // auto close the element
      if (panel.somethingSelected()) return;
      
      var cur = panel.getCursor(false), 
          token = panel.getTokenAt(cur),
          type = token && token.state && token.state.htmlState && token.state.htmlState.context && token.state.htmlState.context.tagName ? token.state.htmlState.context.tagName : 'script',
          line = panel.getLine(cur.line);

      if (token && token.state && token.state.htmlState && token.state.htmlState.context == null) {
        type = 'html';
      }
      
      if (type == 'style') {
        if (line.match(/\s*\/\*/) !== null) {
          // already contains comment - remove
          panel.setLine(cur.line, line.replace(/\/\*\s?/, '').replace(/\s?\*\//, ''));
        } else {
          panel.setLine(cur.line, '/* ' + line + ' */');
        }
      } else if (type == 'script') {
        // FIXME - could put a JS comment next to a <script> tag
        if (line.match(/\s*\/\//) !== null) {
          // already contains comment - remove
          panel.setLine(cur.line, line.replace(/(\s*)\/\/\s?/, '$1'));
        } else {
          panel.setLine(cur.line, '// ' + line);
        }      
      } else {
        if (line.match(/\s*<!--/) !== null) {
          // already contains comment - remove
          panel.setLine(cur.line, line.replace(/<!--\s?/, '').replace(/\s?-->/, ''));
        } else {
          panel.setLine(cur.line, '<!-- ' + line + ' -->');
        }      
      }

      event.stop();
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

  if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
    myEvent.which = event.charCode != null ? event.charCode : event.keyCode;
  }

  // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
  if ( !event.metaKey && event.ctrlKey ) {
    myEvent.metaKey = event.ctrlKey;
  }

  // this is retarded - I'm having to mess with the event just to get Firefox
  // to send through the right value. i.e. when you include a shift key modifier
  // in Firefox, if it's punctuation - event.which is zero :(
  // Note that I'm only doing this for the ? symbol + ctrl + shift
  if (event.which === 0 && event.ctrlKey === true && event.shiftKey === true && event.type == 'keydown') {
    myEvent.which = 191;
  }

  var oldStop = event.stop;
  myEvent.stop = function () {
    myEvent.stopping = true;
    oldStop && oldStop.call(event);
  };

  return myEvent;
}