var Processor = function (url, init, handler) {
  if (typeof handler === 'undefined') {
    handler = init;
    init = null;
  }

  $.getScript(url, function () {
    if (init) init();
    callback = handler;
  });

  var callback = function () {
    console.warn('Processor is not ready yet');
    return '';
  };

  return function () {
    return callback.apply(this, arguments);
  };
};

var processors = jsbin.processors = {
  coffeescript: function () {
    if (!jsbin.settings.processors) {
      jsbin.settings.processors = {};
    }
    jsbin.settings.processors.javascript = 'coffeescript';

    var html = jsbin.panels.panels.html.getCode();

    if (html.indexOf('coffee-script.js') === -1) {
      // force select the traceur in the client HTML
      $('#library').val( $('#library').find(':contains("CoffeeScript")').val() ).trigger('change');
    }

    return function (source) { return source; };
  },
  jade: function () {
    return new Processor(jsbin.root + '/js/vendor/jade.js', function () {
      // init and expose jade
      window.jade = require('jade');
    }, function (source) {
      return jade.compile(source, { pretty: true })();
    });
  },
  less: function () {
    return new Processor(jsbin.root + '/js/vendor/less-1.3.0.min.js', function (source) {
      var css = '';

      less.Parser().parse(source, function (err, result) {
        if (err) {
          console.error(err);
          return;
        }
        css = $.trim(result.toCSS());
      });
      return css;
    });
  },
  stylus: function () {
    return new Processor(jsbin.root + '/js/vendor/stylus.js', function (source) {
      var css = '';

      stylus(source).render(function (err, result) {
        if (err) {
          console.error(err);
          return;
        }
        css = $.trim(result);
      });
      return css;
    });
  },
  traceur: function () {
    if (!jsbin.settings.processors) {
      jsbin.settings.processors = {};
    }
    jsbin.settings.processors.javascript = 'traceur';

    // force select the traceur in the client HTML
    $('#library').val( $('#library').find(':contains("Traceur")').val() ).trigger('change');

    return function (source) { return source; };
  }
};

processors.set = function (panel, preprocessor) {
  if (jsbin.panels.panels[panel]) {
    if (preprocessor && processors[preprocessor]) {
      jsbin.panels.panels[panel].processor = processors[preprocessor]();
    } else {
      // remove the preprocessor
      jsbin.panels.panels[panel].processor = function (source) {
        return source;
      };
    }
  }
};











