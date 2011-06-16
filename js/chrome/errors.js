//= require "../vendor/jshint/jshint"
//= require "../vendor/jquery.tipsy"
var jshint = function () {
  var source = editors.javascript.getCode();
  var ok = JSHINT(source);
  
  return ok ? true : JSHINT.data();
};

var detailsSupport = 'open' in document.createElement('details');

var $error = $('<details><summary>errors</summary></details>').hide();
$('#source .javascript').append($error);

$error.find('summary').click(function () {
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

// $error.tipsy({ 
//   title: function () { 
//     var html = ['<ul>'],
//         errors = JSHINT.data(true).errors;
//     for (var i = 0; i < errors.length; i++) {
//       html.push('Line ' + errors[i].line + ': ' + errors[i].evidence + ' --- ' + errors[i].reason);
//     }
//     
//     return html.join('<li>') + '</ul>';
//   },
//   gravity: 'nw',
//   html: true
// });

$error.delegate('li', 'click', function () {
  var errors = JSHINT.data(true).errors;
  if (errors.length) {
    var i = $error.find('li').index(this);
    editors.javascript.setSelection({ line: errors[i].line - 1, ch: 0 }, { line: errors[i].line - 1 });
    editors.javascript.focus();
    // var line = editors.javascript.nthLine(errors[0].line);
    // editors.javascript.jumpToLine(line);
    // editors.javascript.selectLines(line, 0, editors.javascript.nthLine(errors[0].line + 1), 0);
    return false;
  }
});

var checkForErrors = function () {
  var hint = jshint(),
      jshintErrors = JSHINT.data(true),
      errors = '',
      visible = $error.is(':visible');

  if (hint === true && visible) {
    $error.hide();
    $document.trigger('sizeeditors');
  } else if (jshintErrors.errors.length) {
    var html = ['<ol>'],
        errors = jshintErrors.errors;
    for (var i = 0; i < errors.length; i++) {
      html.push('Line ' + errors[i].line + ': ' + errors[i].evidence + ' --- ' + errors[i].reason);
    }
    
    html = html.join('<li>') + '</ol>';

    $error.find('summary').text(jshintErrors.errors.length == 1 ? '1 error' : jshintErrors.errors.length + ' errors');
    $error.find('ol').remove();

    if (!detailsSupport && $error[0].open == false) html = $(html).hide();
    
    $error.append(html).show();    
    $document.trigger('sizeeditors');
  }
};

$(document).bind('codeChange', throttle(checkForErrors, 1000));
$(document).bind('jsbinReady', checkForErrors);
