(function (window, document, undefined) {

var innerText = document.createElement('i').innerText === undefined ? 'textContent' : 'innerText';

// 1. find all links with class=jsbin
function getLinks() {
  var links, alllinks, i = 0, length;
  if (document.querySelectorAll) {
    links = [].slice.call(document.querySelectorAll('a.jsbin'));
  } else {
    alllinks = document.getElementsByTagName('a');
    length = links.length;
    for (; i < length; i++) {
      if ((' ' + alllinks[i].className + ' ').indexOf(' jsbin ') !== -1) {
        links.push(alllinks[i]);
      }
    }
  }

  return links;
}

function findCodeInParent(element) {
  var match = element;

  while (match = match.previousSibling) {
    console.log(match.nodeName);
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
      element,
      code;

  if (!rel) {
    // go looking through it's parents
    element = findCodeInParent(link);
    if (element) {
      code = element[innerText];
    }
  } else {
    code = document.getElementById(rel.substring(1))[innerText];
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

// 2. process link based on subclass - jsbin-scoop to start with
var links = getLinks(),
    i = 0,
    length = links.length,
    className = '';

for (; i < length; i++) {
  className = ' ' + links[i].className + ' ';
  if (className.indexOf(' jsbin-scoop ') !== -1) {
    scoop(links[i]);
  }
}

}(this, document));