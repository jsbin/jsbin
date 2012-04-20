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
  },
  shortcode: function () {
    var vowels = 'aeiou',
        consonants = 'bcdfghjklmnpqrstvwxyz',
        word = '', length = 6, index = 0, set;

    for (; index < length; index += 1) {
      set = (index % 2 === 0) ? vowels : consonants;
      word += set[Math.floor(Math.random() * set.length)]; 
    }

    return word;
  }
};
