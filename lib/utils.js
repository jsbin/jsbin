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
  },
  titleForBin: function (bin) {
    // Try and get title from HTML first, unlike the PHP version we're
    // returning the HTML title first as that seems to make most sense.
    // TODO: Use HTML parser or JSDOM
    var matches = bin.html.match(/<title>([^>]*)<\/title>/),
        javascript;

    if (matches) {
      return matches[1];
    }

    // No title return JavaScript.
    javascript = bin.javascript.trim();
    if (javascript) {
      return javascript.replace(/\s+/g, ' ');
    }

    matches = bin.html.match(/<body.*>([^\s]*)/);
    if (matches) {
      return matches[1];
    }
    return '';
  }
};
