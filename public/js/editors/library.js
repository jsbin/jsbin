/*global $:true, editors:true, libraries:true, analytics:true */
// 'use strict'; // this causes bigger issues :-\

var $library = $('#library'),
    groups = {};

$library.bind('init', function () {
  var i = 0,
    j = 0,
    k = 0,
    library = {},
    groupOrder = [],
    group = {},
    groupLabel = '',
    lcGroup = '';

  // reset
  groups = {};
  $library.empty();

  for (i = 0; i < libraries.length; i++) {
    library = libraries[i];
    groupLabel = library.group || 'Other';
    lcGroup = groupLabel.toLowerCase().replace(/[^a-z0-9]/ig, '');
    if (groupOrder.indexOf(lcGroup) === -1) {
      group = { label: groupLabel, libraries: [], key: lcGroup };
      groups[lcGroup] = group;
      groupOrder.push(lcGroup);
    } else {
      group = groups[lcGroup];
    }

    group.libraries.push(library);
  }

  var html = ['<option value="none">None</option>'];

  for (i = 0; i < groupOrder.length; i++) {
    group = groups[groupOrder[i]];
    html.push('<option value="" data-group="' + group.label + '" class="heading">-------------</option>');

    for (j = 0; j < group.libraries.length; j++) {
      library = group.libraries[j];
      html.push('<option value="' + group.key + ':' + j + '">' + library.label + '</option>');
    }
  }

  $library.html( html.join('') );
}).trigger('init');


$library.bind('change', function () {
  if (!this.value) { return; }

  var selected = this.value.split(':'),
      group = groups[selected[0]],
      library = group.libraries[selected[1]];

  analytics.library('select', group.libraries[selected[1]].label);
  insertResources(library.url);
}).on('click', function () {
  analytics.library('open');
});

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
      cssNeededAttr = ' rel="stylesheet" type="text/css"';

  for (i = 0; i < length; i++) {
    url = urls[i];

    file = url.split('/').pop();

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
      resource = '<' + 'link href="' + url + '"' + cssNeededAttr  + ' />';
    } else {
      resource = '<' + 'script src="' + url + '"><' + '/script>';
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
