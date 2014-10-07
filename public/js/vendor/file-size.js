// File-Size | 0.0.3 | MIT | Nijiko Yonskai <nijikokun@gmail.com> | 2013
(function () {
  var filesize = function (bytes, options) {
    bytes = typeof bytes == 'number' ? bytes : 0;

    options = options || {};
    options.fixed = typeof options.fixed == 'number' ? options.fixed : 2;
    options.spacer = typeof options.spacer == 'string' ? options.spacer : ' ';

    var sizable = {
      calculate: function (SI) {
        var algorithm = SI ? 1e3 : 1024
          , magnitude = Math.log(bytes) / Math.log(algorithm)|0
          , result = (bytes / Math.pow(algorithm, magnitude));

        return {
          magnitude: magnitude,
          result: result,
          fixed: parseFloat(result.toFixed(options.fixed))
        };
      },

      to: function (unit, si) {
        unit = typeof unit == 'string' ? unit[0].toUpperCase() : 'B';

        var algorithm = si ? 1e3 : 1024
          , units = 'BKMGTPEZY'.split('')
          , position = units.indexOf(unit)
          , result = bytes;

        if (position == -1 || position == 0) return result;
        for (; position > 0; position--) result /= algorithm;
        return parseFloat(result.toFixed(options.fixed));
      },

      human: function (spec) {
        spec = spec || {};

        var algorithm = spec.si ? ['k', 'B'] : ['K', 'iB']
          , input = sizable.calculate(spec.si)
          , magnitude = input.magnitude - 1;

        if (magnitude < 3 && !spec.si && spec.jedec) algorithm[1] = 'B';
        return input.fixed + options.spacer + (input.magnitude ? (algorithm[0] + 'MGTPEZY')[magnitude] + algorithm[1] : (input.fixed && input.fixed|0 === 1 ? 'Byte' : 'Bytes'));
      }
    };

    return sizable;
  };

  if (typeof module !== 'undefined' && module.exports) {
    return module.exports = filesize;
  } else if (typeof define === 'function' && define.amd) {
    return define([], function() {
      return filesize;
    });
  } else {
    this.filesize = filesize;
  }
}());
