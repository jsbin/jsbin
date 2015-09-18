/*global $:true, editors:true, libraries:true, analytics:true */
// 'use strict'; // this causes bigger issues :-\

var $library = $('#library'),
    $libraryInput = $('#library > input'),
    $libraryLabel = $('#library > label'),
    $libraryOptions = $('#library > ul'),
    librarySearch = '',
    highlightedItem = 0,
    groups = {};

function selectItem($option){
  var library = _.find(libraries, {label: $option.data('label')});
  if(library !== undefined){
    analytics.library('select', library.label);
    insertResources(library.url);
    if(library.snippet){
      insertResources(library.snippet);
    }
  }
}

$libraryOptions.on('click li', function(e){
  selectItem($(e.target));
});

$libraryInput.bind('focus', function(){
  analytics.library('open');
  $library.addClass('open');
  $libraryLabel.hide();
});

$libraryInput.bind('blur', function(){
  $libraryLabel.show();
  $library.removeClass('open');
  $libraryInput.val('');
});

$libraryInput.bind('cut', function(e){
  librarySearch = e.target.value;
  $library.trigger('render');
});

$libraryInput.bind('paste', function(e){
  librarySearch = e.target.value;
  $library.trigger('render');
});

$libraryInput.bind('keydown', function(e){
  // if user pressed enter don't rerender dropdown
  if(e.keyCode === 13){
    selectItem($libraryOptions.find('.selected'));

  // if user pressses escape, close the dropdown
  }else if(e.keyCode === 27){
    $libraryInput.trigger('blur');

  // If user presses up or down move highlighted item
  }else{
    if(e.keyCode === 40){
      highlightedItem++;
    }else if(e.keyCode === 38 && highlightedItem > 0){
      highlightedItem--;
    }

    librarySearch = e.target.value;
    $library.trigger('render');
  }
  scrollHighlightIntoView();
});

function scrollHighlightIntoView(){
  var $highlightedOption = $libraryOptions.find('.selected');
  var elTop = $highlightedOption.position().top;
  var containerScrollTop = $libraryOptions.scrollTop();
  var elHeight = $highlightedOption.outerHeight();
  var containerHeight = $libraryOptions.outerHeight();

  // If the highlighted option is beyond the boundaries
  // of the scrollable container, adjust the scroll position
  // of the container

  // if it is it above the boundaries
  if( elTop < 0 ){
    // then align the top of the scrollable container with
    // the top of the highlighted element
    var scrollTo = containerScrollTop + elTop;
    $libraryOptions.scrollTop(scrollTo);

  // if it is below the boundaries
  }else if( elTop + elHeight > containerHeight){
    // then align the bottom of the scrollable container with
    // the bottom of the highlighted element
    $libraryOptions.scrollTop(containerScrollTop + ((elTop + elHeight) - containerHeight));
  }
}

$libraryInput.bind('keyup', function(e){
  librarySearch = e.target.value;
  $library.trigger('render');
});


$library.bind('render', function(){
  var token = librarySearch.toLowerCase().trim();

  // save libraries whose label match the search
  var filteredLibraries = _(libraries).filter(function(library){
    return library.label.toLowerCase().indexOf(token) > -1 || 
      librarySearch.trim().length < 1
  }).sortBy('label').value();

  var optionsCount = filteredLibraries.length-1

  // reset the selected item if we've moved beyond the array
  if(highlightedItem > optionsCount && optionsCount > 1){
    highlightedItem = filteredLibraries.length-1;
  }else if(optionsCount === 0){
    highlightedItem = 0;
  }

  var renderedOptions = _.map(filteredLibraries, function(library, i){
    if(highlightedItem === i){
      return '<li class="selected" data-label="'+library.label+'">' + library.label + '</li>';
    }else{
      return '<li data-label="'+library.label+'">' + library.label + '</li>';
    }
  });

  if(renderedOptions.length < 1){
    renderedOptions.push('<li class="library-option">No matches for <strong>' + token + '</strong></li>');
  }

  $libraryOptions.empty();
  $libraryOptions.html( renderedOptions.join('') );
});

$library.bind('init', function () {
  $library.trigger('render');
}).trigger('init');

function insertResources(urls) {
  if (!$.isArray(urls)) {
    urls = [urls];
  }

  var i = 0,
      length = urls.length,
      url = '',
      code = editors.html.getCode(),
      state = { line: editors.html.editor.currentLine(),
        character: editors.html.editor.getCursor().ch,
        add: 0
      },
      html = [],
      file = '',
      resource,
      attrList,
      attrs,
      scriptDefaultAttrs = {},
      cssDefaultAttrs = { 'rel': 'stylesheet', 'type': 'text/css' };

  for (i = 0; i < length; i++) {
    url = urls[i];

    // URLs can be objects carrying desired attributes
    // The main resource (src, href) property is always 'url'
    if ($.isPlainObject(url)) {
      attrs = url;
      url = url.url;
      delete attrs.url;
    } else {
      attrs = {};
    }

    file = url.split('/').pop();

    // Introduce any default attrs and flatten into a list for insertion
    attrs = $.extend({}, (isCssFile(file) ? cssDefaultAttrs : scriptDefaultAttrs), attrs);
    attrList = '';
    for (var attr in attrs) {
      attrList += ' ' + attr + '="' + attrs[attr] + '"';
    }

    if (file && code.indexOf(file + '"')) {
      // attempt to lift out similar scripts
      if (isCssFile(file)) {
        code = code.replace(new RegExp('<link.*href=".*?/' + file + '".*?/>\n?'), '');
      } else {
        code = code.replace(new RegExp('<script.*src=".*?/' + file + '".*?><' + '/script>\n?'), '');
      }
      state.add--;
    }

    if (isCssFile(url)) {
      resource = '<' + 'link href="' + url + '"' + attrList  + ' />';
    } else {
      resource = '<' + 'script src="' + url + '"' + attrList + '><' + '/script>';
    }

    if (isJadeActive()) {
      resource = isCssFile(url) ? htmlLinkToJade(resource) : htmlScriptToJade(resource);
    }

    html.push(resource);

    state.add++;
  }

  if (isJadeActive()) {
    // always append Jade at the end, it's just easier that way...okay?
    var indent = (code.match(/html.*\n(\s*)\S?/i) || [,])[1];
    code = code.trim() + '\n' + indent + html.join('\n' + indent).trim();
  } else {
    if (code.indexOf('<head') !== -1) {
      code = code.replace(/<head>/i, '<head>\n' + html.join('\n'));
    } else { // add to the start of the doc
      code = html.join('\n') + code;
    }
  }

  editors.html.setCode(code);
  editors.html.editor.setCursor({ line: state.line + state.add, ch: state.character });

}

function insertSnippet(snippet) {
  var code = editors.html.getCode(),
      state = { line: editors.html.editor.currentLine(),
        character: editors.html.editor.getCursor().ch,
        add: 0
      };

  if (code.indexOf('</head') !== -1) {
    code = code.replace(/<\/head>/i, snippet + '\n</head>');
  } else { // add to the start of the doc
    code = snippet + '\n' + code;
  }

  editors.html.setCode(code);
  editors.html.editor.setCursor({ line: state.line + state.add, ch: state.character });
}

function createHTMLToJadeTagConverter(tagName, attribute, suffix){
  var regExToGrabResource = new RegExp(attribute+'=(\'|").+.'+suffix+'\\1');
  return function(html){
    var resource = html.match(regExToGrabResource);
    return tagName+'('+resource[0]+')';
  };
}

var htmlScriptToJade = createHTMLToJadeTagConverter('script', 'src', 'js');
// Dirty, but good enough for now, parse the link and add commas between attributes;
var htmlLinkToJade = (function(){
  var parseLink = createHTMLToJadeTagConverter('link', 'href', 'css');
  return function(html){
    var jadeLink = parseLink(html);
    return jadeLink.split('" ').join('",');
  };
}());

function isJadeActive(){
  return jsbin.state.processors.html === 'jade';
}

function isCssFile(url) {
  return (url.length - (url.lastIndexOf('.css') + 4) === 0);
}
