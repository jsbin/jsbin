(function (window, document, undefined) {

// exit if we already have a script in place doing this task
if (window.jsbinified !== undefined) return;

/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('domready', function (ready) {

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loaded = /^loade|c/.test(doc[readyState])

  function flush(f) {
    loaded = 1
    while (f = fns.shift()) f()
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f)
    flush()
  }, f)


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn)
      flush()
    }
  })

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left')
          } catch (e) {
            return setTimeout(function() { ready(fn) }, 50)
          }
          fn()
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn)
    })
});

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

  while (match = match.previousSibling) {
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

  if (match) return match;

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
      query = link.search.substring(1),
      element,
      code,
      panels = [];

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
  var htmlcount = (code.split("<").length - 1),
      csscount = (code.split("{").length - 1),
      jscount = (code.split(".").length - 1);

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

function embed(link) {
  var iframe = document.createElement('iframe'),
      resize = document.createElement('div'),
      url = link.href.replace(/edit/, 'embed');
  iframe.src = url;
  iframe._src = url; // support for google slide embed
  iframe.className = link.className; // inherit all the classes from the link
  iframe.id = link.id; // also inherit, giving more style control to the user
  iframe.style.border = '1px solid #aaa';

  var query = getQuery(link.search);
  iframe.style.width = query.width || '100%';
  iframe.style.minHeight = query.height || '300px';
  if (query.height) {
    iframe.style.maxHeight = query.height;
  }
  link.parentNode.replaceChild(iframe, link);

  var onmessage = function (event) {
    event || (event = window.event);
    // * 1 to coerse to number, and + 2 to compensate for border
    iframe.style.height = (event.data.height * 1 + 2) + 'px';
  };

  if (window.addEventListener) {
    window.addEventListener('message', onmessage, false);
  } else {
    window.attachEvent('onmessage', onmessage);
  }
}

var useDOMReady = true,
    scripts = document.getElementsByTagName('script'),
    last = scripts[scripts.length - 1],
    link;

// this supports early embeding - probably only applies to Google's slides.js
if (last.nodeName === 'SCRIPT') { // then it's us
  link = last.previousSibling;
  if (link.nodeName === 'A' && (' ' + link.className + ' ').indexOf(' jsbin-embed ') !== -1) {
    // we have a winner
    useDOMReady = false;
    link.className = link.className.replace(/jsbin\-embed/, '');
    embed(link);
  }
}

if (useDOMReady) {
  window.jsbinified = true;

  domready(function () {
    // 2. process link based on subclass - jsbin-scoop to start with
    var links = getLinks(),
        i = 0,
        length = links.length,
        className = '';

    for (; i < length; i++) {
      className = ' ' + links[i].className + ' ';
      if (className.indexOf(' jsbin-scoop ') !== -1) {
        scoop(links[i]);
      } else if (className.indexOf(' jsbin-embed ') !== -1) {
        embed(links[i]);
      }
    }
  });
}
}(this, document));