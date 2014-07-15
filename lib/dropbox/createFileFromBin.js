var createFileFromBin = (function closure() {
  'use strict';

  var regex = {
    doctype: new RegExp(/<!doctype [^>]*>/i),
    head: new RegExp(/<head[^>]*>([\s\S]*)(<\/head>|<body>)/i),
    body: new RegExp(/<body[^>]*>([\s\S]*)/im),
    htmlTag: new RegExp(/(<html[^>]+>)/i),
    headTag: new RegExp(/(<head[^>]+>)/i),
    bodyTag: new RegExp(/(<body[^>]+>)/i),
  };

  var defaults = {
    doctype: '',
    head: '<style>\n%css%\n</style>',
    body: '<script>\n%code%\n</script>',
  };

  var getHeadContents = function getHeadContents(bin, html) {
    var matches = html.match(regex.head) || [];
    // the content will be in the second capture group
    var content = matches[1] || '';
    // because we check for unclosed head tags the regex isnt perfect
    // we remove a closing one if it's there.
    if (content.indexOf('</head>') !== -1) {
      content = content.split('</head>')[0];
    }
    // make sure that the css is gonna go in here
    if (html.indexOf('%css%') === -1 && bin.css) {
      content += defaults.head;
    } else {
      // Here we might want to check the id of the containing style tag
    }
    return content;
  };

  var getBodyContents = function getBodyContents(bin, html) {
    var htmlHasAHead = regex.headTag.test(html);
    var htmlHasABody = regex.bodyTag.test(html);

    console.log('htmlHasABody', htmlHasABody);

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

    if (html.indexOf('%code%') === -1 && bin.javascript) {
      content += defaults.body;
    } else {
      // Here we might want to check the id of the containing script tag
    }

    return content;

  };

  var createFileFromBin = function createFileFromBin(bin) {
    var file = '';
    var html = bin.html;
    var raw = bin.raw;
    var processors = bin.processors;
    var doctype = (html.match(regex.doctype) || [])[0] || '';



    var htmlTag = (html.match(regex.htmlTag) || [])[0] || '';
    var headTag = (html.match(regex.headTag) || [])[0] || '';
    var bodyTag = (html.match(regex.bodyTag) || [])[0] || '';

    var headContents = getHeadContents(bin, html);
    var bodyContents = getBodyContents(bin, html);

    if (doctype) { file += doctype + '\n'; }
    file += '<!-- file: http://jsbin.com/' + bin.url + '/' + bin.revision + ' -->\n';
    if (htmlTag) { file += htmlTag + '\n'; }
    if (headTag) { file += headTag + '\n'; }
    file += headContents;
    if (headTag) { file += '\n</head>\n'; }
    if (bodyTag) { file += bodyTag + '\n'; }
    file += bodyContents;

    file = file.split('%css%').join(bin.css);
    file = file.split('%code%').join(bin.javascript);

    // If we have the raw panel content - go ahead and stick that in scripts at the bottom.
    if (raw) {
      ['html', 'css', 'javascript'].forEach(function (type) {
        if (raw[type] === undefined) {
          return;
        }
        var content = raw[type].replace(/<\/script>/gi, '<\\/script>').replace(/<!--/g, '<\\!--');
        if (content) {
          file += '\n<script id="jsbin-panel-' + type + '" type="' + (processors[type] || type) + '">\n' + content + '</script>';
        }
      });
    }

    if (bin.html.toLowerCase().indexOf('</body>')) {
      file += '\n</body>';
    }
    if (bin.html.toLowerCase().indexOf('</html>')) {
      file += '\n</html>';
    }

    return file;
  };

  return createFileFromBin;

}());

if (typeof exports !== 'undefined') {
  module.exports = createFileFromBin;
}
