var createFileFromBin = (function closure() {
  'use strict';

  var regex = {
    doctype: new RegExp(/<!doctype [^>]*>/i),
    head: new RegExp(/<head[^>]*>([\s\S]*)(<\/head>|<body>)/i),
    body: new RegExp(/<body[^>]*>([\s\S]*)<\/body>/),
    htmlTag: new RegExp(/(<html[^>]+>)/),
    headTag: new RegExp(/(<head[^>]+>)/),
    bodyTag: new RegExp(/(<body[^>]+>)/),
  };

  var defaults = {
    doctype: '<!DOCTYPE html>',
    head: '<style> %css% </style>',
    body: '<script> %code% </script>',
  };

  var getHeadContents = function getHeadContents (html) {
    var matches = html.match(regex.head) || [];
    // the content will be in the second capture group
    var content = matches[1] || defaults.head;
    // because we check for unclosed head tags the regex isnt perfect
    // we remove a closing one if it's there.
    if (content.indexOf('</head>') !== -1) {
      content = content.split('</head>')[0];
    }
    // make sure that the css is gonna go in here
    if (content.indexOf('%css%') === -1) {
      content += defaults.head;
    } else {
      // Here we might want to check the id of the containing style tag
    }
    return content;
  };

  var getBodyContents = function getBodyContents(html) {
    var htmlHasAHead = regex.headTag.test(html);
    var htmlHasABody = regex.bodyTag.test(html);
    var content = '';
    // this caters for people that wanna put straight markup
    // without head or body tags etc...
    if (htmlHasABody) {
      var matches = html.match(regex.body) || []; 
      content = matches[1] || defaults.body;
    } else {
      if (htmlHasAHead) {
        content = html.split('</head>')[1] || '';
      } else {
        content = html;
      }
    }

    if (content.indexOf('%code%') === -1) {
      content += defaults.body;
    } else {
      // Here we might want to check the id of the containing script tag
    }

    return content;
    
  }; 

  var createFileFromBin = function createFileFromBin (bin) {
    var file = '';
    var html = bin.html;
    var raw = bin.raw;
    var processors = bin.processors;
    var doctype = (html.match(regex.doctype) || [])[0] || defaults.doctype;

    var htmlTag = (html.match(regex.htmlTag) || [])[0] || '<html>';
    var headTag = (html.match(regex.headTag) || [])[0] || '<head>';
    var bodyTag = (html.match(regex.bodyTag) || [])[0] || '<body>';

    var headContents = getHeadContents(html);
    var bodyContents = getBodyContents(html);

    file += doctype + '\n';
    file += htmlTag + '\n' + headTag + '\n';
    file += headContents + '\n</head>\n' + bodyTag + '\n';
    file += bodyContents + '\n</body>\n</html>';
    
    file = file.replace('%css%', bin.css);
    file = file.replace('%code%', (bin.js || bin.javascript));

    // If we have the raw panel content - go ahead and stick that in scripts at the bottom.
    if (raw) {
      file += '\n<script id="jsbin-panel-html" type="' + (processors.html || 'html') + '">\n' + raw.html  + '</script>';
      file += '\n<script id="jsbin-panel-css" type="' + (processors.css || 'css') + '">\n' + raw.css  + '</script>';
      file += '\n<script id="jsbin-panel-js" type="' + (processors.js || processors.javascript || 'js') + '">\n' + raw.js  + '</script>';
    }

    return file;
  };

  return createFileFromBin;

}());

if (typeof exports !== 'undefined') {
  module.exports = createFileFromBin;
}
