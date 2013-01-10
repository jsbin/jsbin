var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    extend = require('soak').mixin,
    inherit = require('soak').inherit,
    EventEmitter = require('events').EventEmitter;

module.exports = {
  // Create a base observable object that inherits from EventEmitter. This
  // allows us to create new objects that can trigger events very easily.
  //
  // Example:
  //
  //   var Store = Observable.extend({
  //     save: function () {}
  //   });
  Observable: inherit(EventEmitter),

  // Helper function for creating an index file in a directory. It loads all
  // modules within the provided directory excluding the file provided as
  // "indexpath". These will then be returned.
  //
  // Example:
  //
  //   module.exports = utils.index(__dirname, __filename);
  index: function (dirname, indexpath) {
    var extensions = {js: 1},
        modules = {};

    indexpath = indexpath || path.join(dirname, 'index.js');

    // Load all exported objects into a single module.
    fs.readdirSync(dirname).forEach(function (filename) {
      var fullpath = path.join(dirname, filename),
          parts    = filename.split('.'),
          module, name;

      if (fullpath !== indexpath && extensions[parts.pop()] && '.' !== filename[0]) {
        name = parts.join('.');
        module = require(fullpath);
  
        // Grab the function name or module name if possible.
        if (typeof module.name === 'string') {
          name = module.name;
        }

        modules[name] = module;
      }
    });

    return modules;
  },

  // Takes an object and a series of method names. Each method will be
  // re-assigned to the object with the object bound as the methods scope. This
  // is generally useful for defining callback methods.
  //
  // An array of method names can also be passed.
  //
  // Example:
  //
  //   object = {onData: function () {}, onEnd: function () {});
  //   utils.bindAll(object, 'onData', 'onEnd');
  //
  //   // Same as doing.
  //   object.onData = object.onData.bind(object);
  //   object.onEnd  = object.onEnd.bind(object);
  bindAll: function (object /* args */) {
    var methods = [].slice.call(arguments, 1);
    if (arguments.length === 2 && Array.isArray(arguments[1])) {
      methods = arguments[1];
    }

    methods.forEach(function (method) {
      if (typeof object[method] === 'function') {
        object[method] = object[method].bind(object);
      }
    });

    return object;
  },

  // Extends the first argument with the properties of the subsequent
  // arguments.
  extend: extend,

  // Simplifies the process of extending existing objects.
  inherit: inherit,

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
  // Returns a gravatar url for the email address provided. An optional size
  // parameter can be provided to specify the size of the avatar to generate.
  gravatar: function (email, size) {
    email = (email || '').trim().toLowerCase();
    var hash = crypto.createHash('md5').update(email).digest('hex');
    return 'http://www.gravatar.com/avatar/' + hash + '?s=' + (size || 26);
  },
  re: {
    flatten: /\s+/g,
    body: /<body.*?>\s*(.*)/m,
    meta: /<meta name="description" content="(.*?)"/,
    tags: /<[^>]+>/g,
    title: /<title>(.*)<\/title>/
  },
  titleForBin: function (bin) {
    var html = (bin.html || '').replace(this.re.flatten, ' '), // flatten
        javascript = (bin.javascript || '').replace(this.re.flatten, ' ').trim(),
        css = (bin.css || '').replace(this.re.flatten, ' ').trim(),
        matches = (html.match(this.re.meta) || []);

    // try to return the meta[description] first
    if (matches.length === 2 && matches[1].trim()) {
      return matches[1];
    }

    // then some of the body content with tags stripped
    matches = (html.match(this.re.body) || ['', ''])[1].replace(this.re.tags, '').trim();

    if (matches) {
      return matches;
    }

    // No title return JavaScript.
    if (javascript) {
      return javascript;
    }

    if (css) {
      return css;
    }

    matches = (html.match(this.re.title) || []);
    if (matches.length === 2 && matches[1].trim()) {
      return matches[1];
    }

    return html.replace(this.re.tags, '').trim();
  },
  since: function (date) {
    var diff    = (+new Date() - date) / 1000,
        message = 'a long time',
        timespan;

    try {
      // make "Thu Jan 10 2013 16:32:37 GMT+0000 (GMT)" into "10 Jan 2013"
      var parts = date.toString().split(' ').slice(1,4);
      message = parts.slice(2).concat(parts.slice(0,2)).reverse().join(' ');
    } catch(e) {}

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
      return message.replace('{timespan}', timespan) + ' ago';
    } else {
      return message;
    }
  },
  queryStringForBin: function (bin, defaults) {
    var params = [];
    ['html', 'javascript', 'css'].forEach(function (key) {
      if (bin[key]) {
        params.push(key);
      }
    });
    params.push('live');
    return params.join(',');
  },
  cleanForRender: function (str) {
    var cache = {
      '\u2028': '&#x2028;',
      '\u2029': '&#x2029;'
    };

    var re, bad;

    for (bad in cache) {
      if (str.indexOf(bad) != -1) {
        re = new RegExp(bad, 'g');
        str = str.replace(re, cache[bad]);
      }
    }

    return str;
  }
};
