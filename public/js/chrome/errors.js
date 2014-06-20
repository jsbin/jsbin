/*globals $:true, JSHINT:true, editors:true, $document:true, escapeHTML:true, jsbin:true, throttle:true */

var jshint = function () {
  var source = editors.javascript.editor.getCode();
  
  // default jshint options
  var options = {
    'eqnull': true
  };
  
  $.extend(options, jsbin.settings.jshintOptions || {});
  var ok = JSHINT(source, options);

  return ok ? true : JSHINT.data();
};

var jshintEnabled = true;

var detailsSupport = 'open' in document.createElement('details');

// yeah, this is happening. Fucking IE...sheesh.
var html = $.browser.msie && $.browser.version < 9 ? '<div class="details"><div class="summary">warnings</div>' : '<details><summary class="summary">warnings</summary></details>';

var $error = $(html).appendTo('.panel.javascript').hide();

$error.find('.summary').click(function () {
  if (!detailsSupport) {
    $(this).nextAll().toggle();
    $error[0].open = !$error[0].open;
  }
  // trigger a resize after the click has completed and the details is close
  setTimeout(function () {
    $document.trigger('sizeeditors');
  }, 10);
});

if (!detailsSupport) {
  $error[0].open = false;
}

// modify JSHINT to only return errors that are of value (to me, for displaying)
JSHINT._data = JSHINT.data;
JSHINT.data = function (onlyErrors) {
  var data = JSHINT._data(),
      errors = [];

  if (onlyErrors && data.errors) {
    for (var i = 0; i < data.errors.length; i++) {
      if (data.errors[i] !== null && data.errors[i].evidence) { // ignore JSHINT just quitting
        errors.push(data.errors[i]);
      } else if (data.errors[i] !== null && data.errors[i].reason.indexOf('Stopping') === 0) {
        errors.push('Fatal errors, unable to continue');
      }
    }
    return {
      errors: errors
    };
  } else {
    data.errors = [];
    return data;
  }
};

$error.delegate('li', 'click', function () {
  var errors = JSHINT.data(true).errors;
  if (errors.length) {
    var i = $error.find('li').index(this);
    if (errors[i].reason) {
      editors.javascript.editor.setSelection({ line: errors[i].line - 1, ch: 0 }, { line: errors[i].line - 1 });
      editors.javascript.editor.focus();
    }
    // var line = editors.javascript.nthLine(errors[0].line);
    // editors.javascript.jumpToLine(line);
    // editors.javascript.selectLines(line, 0, editors.javascript.nthLine(errors[0].line + 1), 0);
    return false;
  }
});

var checkForErrors = function () {
  // exit if the javascript panel isn't visible or jshint is disabled (for example by the user or when using a js preprocessor)
  if (!editors.javascript.visible || !jshintEnabled) return;

  var hint = jshint(),
      jshintErrors = JSHINT.data(true),
      errors = '',
      visible = $error.is(':visible');

  if (hint === true && visible) {
    $error.hide();
    $document.trigger('sizeeditors');
  } else if (jshintErrors.errors.length) {
    var html = ['<ol>'];
    errors = jshintErrors.errors;
    for (var i = 0; i < errors.length; i++) {
      if (typeof errors[i] === 'string') {
        html.push(escapeHTML(errors[i]));
      } else {
        html.push('Line ' + errors[i].line + ': ' + escapeHTML(errors[i].evidence) + ' --- ' + escapeHTML(errors[i].reason));
      }
    }

    html = html.join('<li>') + '</ol>';

    $error.find('.summary').text(jshintErrors.errors.length === 1 ? '1 warning' : jshintErrors.errors.length + ' warnings');
    $error.find('ol').remove();

    if (!detailsSupport && $error[0].open === false) html = $(html).hide();

    $error.append(html).show();
    $document.trigger('sizeeditors');
  }
};

if (jsbin.settings.jshint === true || jsbin.settings.jshint === undefined) {
  $(document).bind('codeChange', throttle(checkForErrors, 1000));
  $(document).bind('jsbinReady', checkForErrors);
}

// })();
