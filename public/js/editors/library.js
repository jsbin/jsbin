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

/* Kendo UI */
(function loadThemes() {
  var themes = {
    'default': {
      name: 'Default',
      colors: ['#ef6f1c', '#e24b17', '#5a4b43', '#ededed']
    },
    'blueopal': {
      name: 'Blue Opal',
      colors: ['#076186', '#7ed3f6', '#94c0d2', '#daecf4']
    },
    'bootstrap': {
      name: 'Bootstrap',
      colors: ['#3276b1', '#67afe9', '#ebebeb', '#ffffff']
    },
    'silver': {
      name: 'Silver',
      colors: ['#298bc8', '#515967', '#bfc6d0', '#eaeaec']
    },
    'uniform': {
      name: 'Uniform',
      colors: ['#666666', '#cccccc', '#e7e7e7', '#ffffff']
    },
    'metro': {
      name: 'Metro',
      colors: ['#8ebc00', '#787878', '#e5e5e5', '#ffffff']
    },
    'black': {
      name: 'Black',
      colors: ['#0167cc', '#4698e9', '#272727', '#000000']
    },
    'metroblack': {
      name: 'Metro Black',
      colors: ['#00aba9', '#0e0e0e', '#333333', '#565656']
    },
    'highcontrast': {
      name: 'High Contrast',
      colors: ['#b11e9c', '#880275', '#664e62', '#1b141a']
    },
    'moonlight': {
      name: 'Moonlight',
      colors: ['#ee9f05', '#40444f', '#2f3640', '#212a33']
    },
    'flat': {
      name: 'Flat',
      colors: ['#363940', '#2eb3a6', '#10c4b2', '#ffffff']
    }
  };
  var assetUrl = 'http://cdn.kendostatic.com/2013.3.1324/styles/';
  var assetPrefix = 'kendo.';
  var assetSuffix = '.min.css';
  var $themeSelected;
  var $themeLinks;
  var menu = '';
  var reg = [];
  var foundArray;
  var found = '';

  menu += '<ul class="tc-theme-container js-theme">';
  for (var prop in themes) {
    if (themes.hasOwnProperty(prop)) {
      reg.push(prop);
      menu += '<li><a href="#' + prop + '">';
      menu += '<strong>' + themes[prop].name + '</strong>';
      for (var m = 0; m < themes[prop].colors.length; m++) {
        menu += '<span style="background:' + themes[prop].colors[m] + '"></span>';
      }
      menu += '</a></li>';
    }
  }
  menu += '</ul>';

  menu = '<div class="menu">' +
          '<a href="#themes" target="_blank" class="button button-dropdown group button-dropdown-arrow">' +
          'Theme: <span id="theme-selected" class="tc-theme-default">Default</span></a>' +
          '<div class="dropdown" id="themes">' +
          '<div class="dropdownmenu">' +
          menu +
          '</div></div></div>';

  $('#sharemenu').before(menu);

  $themeSelected = $('#theme-selected');

  $themeLinks = $('.js-theme a');
  $themeLinks.bind('click', function(e) {
    e.preventDefault();
    var val = $(this).attr('href').replace('#', '');
    changeTheme(val);
    $themeSelected.html(themes[val].name).attr('class', 'tc-theme-' + val);
  });

  // check for existing theme
  reg = reg.join('|');
  reg = assetUrl + assetPrefix + '(' + reg + ')' + assetSuffix;
  reg = new RegExp(reg, 'gi');
  while ((foundArray = reg.exec(template.html)) !== null) {
    found = foundArray[1];
  }
  if (found) {
    $themeSelected.html(themes[found].name).attr('class', 'tc-theme-' + found);
  }

  function changeTheme(theme) {
    var code = editors.html.getCode();
    var state = { 
      line: editors.html.editor.currentLine(),
        character: editors.html.editor.getCursor().ch,
        add: 0
    };
    var resource;
    var cssNeededAttr = ' rel="stylesheet" type="text/css"';
    var file;
    var url = assetUrl + assetPrefix + theme + assetSuffix;
    for (var prop in themes) {
      if (themes.hasOwnProperty(prop)) {
        file = assetPrefix + prop + assetSuffix;
        if (code.indexOf(file + '"')) {
          code = code.replace(new RegExp('<link.*href=".*?/' + file + '".*?/>\n?'), '');
        }
      }
    }
    resource = '<' + 'link href="' + url + '"' + cssNeededAttr  + ' />';
    if (code.indexOf('</head') !== -1) {
      code = code.replace(/<\/head>/i, resource + '\n</head>');
    }
    else {
      code = resource + code;
    }

    editors.html.setCode(code);
    editors.html.editor.setCursor({ line: state.line + state.add, ch: state.character });
  }
})();