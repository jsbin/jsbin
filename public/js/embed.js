(function (window, document, undefined) {
  'use strict';
  var addEventListener = window.addEventListener ? 'addEventListener' : 'attachEvent';

  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license
  (function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  }());

  // exit if we already have a script in place doing this task
  if (window.jsbinified !== undefined) {
    return;
  }

  // flag to say we don't need this script again
  window.jsbinified = true;

  /*!
    * domready (c) Dustin Diaz 2012 - License MIT
    */
  var domready = (function domready() {
    var fns = [],
        listener,
        doc = document,
        hack = doc.documentElement.doScroll,
        domContentLoaded = 'DOMContentLoaded',
        loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);


    if (!loaded) {
      doc.addEventListener(domContentLoaded, listener = function () {
        doc.removeEventListener(domContentLoaded, listener);
        loaded = 1;
        while (listener = fns.shift()) { // jshint ignore:line
          listener();
        }
      });
    }

    return function (fn) {
      if (loaded) {
        setTimeout(fn, 0);
      } else {
        fns.push(fn);
      }
    };
  })();

  function getQuery(querystring) {
    var query = {};

    var pairs = querystring.split('&'),
        length = pairs.length,
        keyval = [],
        i = 0;

    for (; i < length; i++) {
      keyval = pairs[i].split('=', 2);
      try {
        keyval[0] = decodeURIComponent(keyval[0]); // key
        keyval[1] = decodeURIComponent(keyval[1]); // value
      } catch (e) {}

      if (query[keyval[0]] === undefined) {
        query[keyval[0]] = keyval[1];
      } else {
        query[keyval[0]] += ',' + keyval[1];
      }
    }

    return query;
  }


  // ---- here begins the jsbin embed - based on the embedding doc: https://github.com/jsbin/jsbin/blob/master/docs/embedding.md

  var innerText = document.createElement('i').innerText === undefined ? 'textContent' : 'innerText';

  // 1. find all links with class=jsbin
  function getLinks() {
    var links = [], alllinks, i = 0, length;
    alllinks = document.getElementsByTagName('a');
    length = alllinks.length;
    for (; i < length; i++) {
      if ((' ' + alllinks[i].className).indexOf(' jsbin-') !== -1) {
        links.push(alllinks[i]);
      }
    }

    return links;
  }

  function findCodeInParent(element) {
    var match = element;

    while (match = match.previousSibling) { // jshint ignore:line
      if (match.nodeName === 'PRE') {
        break;
      }
      if (match.getElementsByTagName) {
        match = match.getElementsByTagName('pre');
        if (match.length) {
          match = match[0]; // only grabs the first
          break;
        }
      }
    }

    if (match) {
      return match;
    }

    match = element.parentNode.getElementsByTagName('pre');

    if (!match.length) {
      if (element.parentNode) {
        return findCodeInParent(element.parentNode);
      } else {
        return null;
      }
    }

    return match[0];
  }

  function findCode(link) {
    var rel = link.rel,
        element,
        code;

    if (rel && (element = document.getElementById(rel.substring(1)))) {
      code = element[innerText];
    // else - try to support multiple targets for each panel...
    // } else if (query.indexOf('=') !== -1) {
    //   // assumes one of the panels points to an ID
    //   query.replace(/([^,=]*)=([^,=]*)/g, function (all, key, value) {
    //     code = document.getElementById(value.substring(1))[innerText];

    //   });
    } else {
      // go looking through it's parents
      element = findCodeInParent(link);
      if (element) {
        code = element[innerText];
      }
    }

    return code;
  }

  function detectLanguage(code) {
    var htmlcount = (code.split('<').length - 1),
        csscount = (code.split('{').length - 1),
        jscount = (code.split('.').length - 1);

    if (htmlcount > csscount && htmlcount > jscount) {
      return 'html';
    } else if (csscount > htmlcount && csscount > jscount) {
      return 'css';
    } else {
      return 'javascript';
    }
  }

  function scoop(link) {
    var code = findCode(link),
        language = detectLanguage(code),
        query = link.search.substring(1);

    if (language === 'html' && code.toLowerCase().indexOf('<html') === -1) {
      // assume this is an HTML fragment - so try to insert in the %code% position
      language = 'code';
    }

    if (query.indexOf(language) === -1) {
      query += ',' + language + '=' + encodeURIComponent(code);
    } else {
      query = query.replace(language, language + '=' + encodeURIComponent(code));
    }

    link.search = '?' + query;
  }

  function hookMessaging(iframe) {
    var onmessage = function (event) {
      if (!event) { event = window.event; }
      // * 1 to coerse to number, and + 2 to compensate for border
      iframe.style.height = (event.data.height * 1 + 2) + 'px';
    };

    window[addEventListener]('message', onmessage);
  }

  function loadRealEmbed(iframe) {
    var clone = iframe.cloneNode();
    var url = clone.getAttribute('data-url');

    clone.src = url.split('&')[0];
    clone._src = url.split('&')[0]; // support for google slide embed
    iframe.parentNode.replaceChild(clone, iframe);
    hookMessaging(clone);
  }

  function embed(link) {
    var iframe = document.createElement('iframe');
    var url = link.href.replace(/edit/, 'embed');

    iframe.className = link.className; // inherit all the classes from the link
    iframe.id = link.id; // also inherit, giving more style control to the user
    iframe.style.border = '1px solid #aaa';

    var query = getQuery(link.search);
    iframe.style.width = query.width || '100%';
    iframe.style.minHeight = query.height || '300px';
    if (query.height) {
      iframe.style.maxHeight = query.height;
    }

    // track when it comes into view and reload
    if (inview(link, 100)) {
      // the iframe is full view, let's render it
      iframe.src = url.split('&')[0];
      iframe._src = url.split('&')[0]; // support for google slide embed
      hookMessaging(iframe);
    } else {
      iframe.setAttribute('data-url', url);
      iframe.src = 'https://jsbin.com/embed-holding';

      pending.push(iframe);
    }

    link.parentNode.replaceChild(iframe, link);
  }

  function readLinks() {
    var links = getLinks(),
        i = 0,
        length = links.length,
        className = '';

    for (; i < length; i++) {
      className = ' ' + links[i].className + ' ';
      if (className.indexOf(' jsbin-scoop ') !== -1) {
        scoop(links[i]);
      } else if (className.indexOf(' jsbin-embed ') !== -1) {
        links[i].className = links[i].className.replace(/jsbin\-embed/, '');
        embed(links[i]);
      }
    }
  }

  var docElem = document && document.documentElement;

  function viewportW() {
    var a = docElem.clientWidth;
    var b = window.innerWidth;
    return a < b ? b : a;
  }

  function viewportH() {
    var a = docElem.clientHeight;
    var b = window.innerHeight;
    return a < b ? a : b;
  }

  function calibrate(coords, cushion) {
    var o = {};
    cushion = +cushion || 0;
    o.width = (o.right = coords.right + cushion) - (o.left = coords.left - cushion);
    o.height = (o.bottom = coords.bottom + cushion) - (o.top = coords.top - cushion);
    return o;
  }

  function inview(el, cushion) {
    var r = calibrate(el.getBoundingClientRect(), cushion);
    return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
  }

  function checkForPending() {
    var i = 0;
    var todo = [];
    for (i = 0; i < pending.length; i++) {
      if (inview(pending[i], 400)) {
        todo.unshift({ iframe: pending[i], i: i });
      }
    }

    for (i = 0; i < todo.length; i++) {
      pending.splice(todo[i].i, 1);
      loadRealEmbed(todo[i].iframe);
    }
  }

  var pending = [];

  // this supports early embeding - probably only applies to Google's slides.js
  readLinks();

  // try to read more links once the DOM is done
  domready(function () {
    readLinks();
    var id = null;
    function handler() {
      if (pending.length) {
        cancelAnimationFrame(id);
        id = requestAnimationFrame(checkForPending);
      } else {
        // detatch the scroll handler
      }
    }
    docElem[addEventListener]('scroll', handler, true);
    window[addEventListener]('scroll', handler, true);
  });

}(this, document));