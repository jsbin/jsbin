var Processor = function (id, url, handler) {
  $.getScript(url, function () {
    callback = handler;
  });

  var callback = function () {
    console.warn(id + ' processor is not ready yet');
  };

  return function () {
    return callback.apply(this, arguments);
  };
};

var processors = jsbin.processors = {
  coffeescript: function () {
    return new Processor('coffeescript', '/js/vendor/coffee-script.js', function (source) {
      var renderedCode = '';
      try {
        renderedCode = CoffeeScript.compile(source, {
          bare: true
        });
      } catch (e) {
        console.error(e.message);
      }
      return renderedCode;
    });
  },
  less: function () {
    return new Processor('less', '/js/vendor/less-1.3.0.min.js', function (source) {
      var css = '';

      less.Parser().parse(source, function (err, result) {
        if (err) {
          console.error(err);
          return;
        }
        css = result.toCSS();
      });
      return css;
    });
  }
};