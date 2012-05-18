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
  isAjax: function (req) {
    return (req.get('X-Requested-With') || '').toLowerCase() === 'xmlhttprequest';
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
    var html = bin.html || '',
        javascript = (bin.javascript || '').trim(),
        matches = html.match(/<title>([^>]*)<\/title>/);

    if (matches) {
      return matches[1];
    }

    // No title return JavaScript.
    if (javascript) {
      return javascript.replace(/\s+/g, ' ');
    }

    matches = html.match(/<body.*>([^\s]*)/);
    if (matches) {
      return matches[1];
    }
    return '';
  },
  since: function (date) {
    var diff    = (+new Date() - date) / 1000,
        message = 'a long time',
        timespan;

    if (diff < 60) {
      timespan = Math.floor(diff);
      message  = '{timespan} second';
    }
    else if (diff < 3600) {
      timespan =  Math.floor(diff / 60);
      message  = 'about {timespan} minute';
    }
    else if (diff < 86400) {
      timespan = Math.floor(diff / 3600);
      message  = 'around {timespan} hour';
    }
    else if (diff < 604800) {
      timespan = Math.floor(diff / 86400);
      message  = 'about {timespan} day';
    }
    else if (diff < 2419200) {
      timespan = Math.ceil(diff / 604800);
      message  = 'nearly {timespan} week';
    }
    else if (diff < 29030400) {
      timespan = Math.floor(diff / 2419200);
      message  = 'about {timespan} month';
    }

    if (timespan !== 1 && timespan) {
      message += 's';
    }

    return message.replace('{timespan}', timespan) + ' ago';
  },
  queryStringForBin: function (bin, defaults) {
    var params = [];
    ['html', 'javascript', 'css'].forEach(function (key) {
      if (bin[key] !== defaults[key]) {
        params.push(key);
      }
    });
    return params.join(',');
  },
};
