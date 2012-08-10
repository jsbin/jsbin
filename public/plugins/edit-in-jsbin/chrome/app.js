var clickedEl = null,
    innerText = document.createElement('i').innerText === undefined ? 'textContent' : 'innerText';

// track the right click - when it happens, we capture the element that the context
// menu was triggered from. This used to be onmousedown, but it was testing for 
// right click via event.button === 2, but on a Mac ctrl+click == right clikc, 
// yet event.button === 0. So I'm using this sucker.
document.addEventListener("contextmenu", function(event){
  clickedEl = event.target;
}, true);

// this event is triggered from the "background" page, when the context
// menu is opened, it asks for the code. This request requires the 
// clickedEl to be in place. If it isn't - it's kinda screwed!
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request == "getClickedEl" && clickedEl) {
    var code = getJSBinURL(clickedEl);

    if (code) {
      sendResponse(code);
      // postForm(code);
    } else {
      // this should be pretty unlikely
      alert("Couldn't find the code - sorry. Copy & Paste?");
    }
  } 
});

function getJSBinURL(element) {
  var code = findCode(element),
      language = detectLanguage(code),
      url = null,
      data = {};

  if (code) {
    data.language = language;
    data.code = code;
    // url = 'http://jsbin.com?live,' + language + '=' + encodeURIComponent(code);
  } else {
    data = null
  }

  return data;
}

function findCode(element) {
  var code = '',
      found = findCodeInParent(element);

  if (found) {
    code = found[innerText];
  }
  return code;
}

function findCodeInParent(element) {
  var match = element;

  // first try searching upwards
  while (match && match.nodeName !== 'PRE') {
    match = match.parentNode;
  }

  if (match && match.nodeName === 'PRE') return match;

  // reset
  match = element;

  // then try searching by previous neighbour (as used in the scoop embed)
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

  // otherwise try finding any pre element
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

function detectLanguage(code) {
  var htmlcount = (code.split("<").length - 1),
      csscount = (code.split("{").length - 1),
      jscount = (code.split(".").length - 1);

  if (/<html/i.test(code) || (htmlcount > csscount && htmlcount > jscount)) {
    return 'html';
  } else if (csscount > htmlcount && csscount > jscount) {
    return 'css';
  } else {
    return 'javascript';
  }
}