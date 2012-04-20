module.exports = {
  extract: function (obj /* keys */) {
    var keys = [].slice.call(arguments, 1),
        collected = {};

    keys.forEach(function (key) {
      if (obj[key]) {
        collected[key] = obj[key];
      }
    });

    return collected;
  }
};
