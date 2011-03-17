window.jsbin = {};

// once these features are live, they come out of the jsbin beta box
(function () {  
  //= require "stream"
  
  // expose...for now
  window.stream = jsbin.stream;
  
  //= require "../render/live"
  jsbin.livePreview = function () {
    $('#live').trigger('toggle');
  };
  
  //= require "../vendor/jshint/jshint"
  //= require "../vendor/jquery.tipsy"
  this.jshint = function () {
    var source = editors.javascript.getCode();
    var ok = JSHINT(source);
    
    return ok ? true : JSHINT.data();
  };
  
  var $error = $('<em>errors</em>').hide();
  $('#jslabel').append($error);
  
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
      return data;
    }
  };
  
  $error.tipsy({ 
    title: function () { 
      var html = ['<ul>'],
          errors = JSHINT.data(true).errors;
      for (var i = 0; i < errors.length; i++) {
        html.push('Line ' + errors[i].line + ': ' + errors[i].evidence + ' --- ' + errors[i].reason);
      }
      
      return html.join('<li>') + '</ul>';
    },
    gravity: 'nw',
    html: true
  });
  
  $error.click(function () {
    var errors = JSHINT.data(true).errors;
    if (errors.length) {
      var line = editors.javascript.nthLine(errors[0].line);
      editors.javascript.jumpToLine(line);
      editors.javascript.selectLines(line, 0, editors.javascript.nthLine(errors[0].line + 1), 0);
      return false;
    }
  });
  
  var checkForErrors = function () {
    var jshint = jsbin.jshint(),
        errors = '';

    if (jshint === true) {
      $error.text('').hide();
    } else {
      errors = JSHINT.data(true).errors.length;
      errors = errors == 1 ? '1 error' : errors + ' errors';
      $error.text('(' + errors + ')').show();
    }
  };
  
  $(document).bind('codeChange', throttle(checkForErrors, 1000));
  $(document).bind('jsbinReady', checkForErrors);
}).call(jsbin);

function throttle(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}