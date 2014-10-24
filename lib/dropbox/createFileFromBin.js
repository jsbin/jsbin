(function (root, factory) {
  'use strict';
  /*global define*/
  if (typeof define === 'function' && define.amd) {
    define(factory());
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.htmlFromBin = factory();
  }
})(this, function htmlFromBin() {
  'use strict';

  var doctypeRe = new RegExp(/^<!doctype[^>]*>\n?/im);

  function insert(source, needle, value, options) {
    if (source.toLowerCase().indexOf(needle.toLowerCase()) === -1) {
      return null;
    }

    if (!options) {
      options = {};
    }

    var left = source.substring(0, source.toLowerCase().lastIndexOf(needle.toLowerCase()));
    var right = source.substring(source.toLowerCase().lastIndexOf(needle.toLowerCase()));

    // var parts = source.split(needle);
    // var last  = parts.pop();
    var result = '';
    if (left && right) {
      // Add it just after before the end head tag if we can
      if (options.after) {
        result = left + needle + value + right;
      } else {
        result = left + value + '\n' + needle + right;
      }
    }
    return result;
  }

  function safeForHTML(s) {
    return s.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
  }

  return function htmlFromBin(bin) {
    if (!bin) {
      console.error('htmlFromBin requires bin object', (new Error()).stack);
      return '<!DOCTYPE html>';
    }

    var file = '';
    var html = bin.html.replace(/(\r\n)/g, '\n'); // remove windows nl.
    var source = bin.source;
    var css = safeForHTML(bin.css || '');
    var javascript = safeForHTML(bin.javascript || '');
    var processors = bin.processors;
    var meta = bin.meta || '<!-- source: http://jsbin.com/' + bin.url + '/' + (bin.revision || '') + ' -->\n';

    /**
     * 1. strip the doctype and print it then add comment (<!-- file... etc)
     * 2. in remaining code:
     *   - is there %css%?
     *    yes: replace with CSS
     *    no: look for head - is there head?
     *      yes: insert style tag
     *      no: try after the <title> tag, or prepend to top: <style>css</style>
     *   - is there %code%
     *    yes: replace with JS
     *    no: look for closing </body> - is there closing </body>
     *      yes: insert above this
     *      no: append to end (closing HTML?)
     *   - is there closing body or html?
     *     yes: insert "source script tags" above
     *     no: append source scripts
     *
     */

    file = html;

    if (css) {
      if (file.indexOf('%css%') !== -1) {
        file = file.split('%css%').join(bin.css);
      } else {
        // is there head tag?
        css = '<style>\n' + css + '\n<style>\n';
        var head = insert(file, '</head>', css);
        if (head) {
          file = head;
        } else {
          var title = insert(file, '</title>', css, { after: true });
          if (title) {
            file = title;
          } else {
            // slap on the top (note that this is *before* the doctype)
            file = css + file;
          }
        }
      }
    }

    // only look for a doctype at the top of the document
    var doctype = (html.trim().split('\n').shift().trim().match(doctypeRe) || [])[0] || '';

    if (doctype) {
      file = file.replace(doctypeRe, doctype + '\n' + meta);
      // strip from original html
    } else {
      file = meta + file;
    }


    if (javascript) {
      if (file.indexOf('%code%') !== -1) {
        file = file.split('%code%').join(javascript);
      } else {
        // is there head tag?
        javascript = '<script>\n' + javascript + '\n</script>\n';
        var body = insert(file, '</body>', javascript);
        if (body) {
          file = body;
        } else {
          // slap on the bottom
          file = file + '\n' + javascript;
        }
      }
    }

    // If we have the raw panel content - go ahead and stick that in scripts at the bottom.
    if (source) {
      var sourceScripts = ['html', 'css', 'javascript'].map(function (type) {
        if (source[type] === undefined) {
          return '';
        }
        var content = safeForHTML(source[type]);
        if (content) {
          return '\n<script id="jsbin-panel-' + type + '" type="text/' + (processors[type] || type) + '">\n' + content + '</script>';
        }
      }).join('\n');

      var bodytag = insert(file, '</body>', sourceScripts);
      if (bodytag) {
        file = bodytag;
      } else {
        file += sourceScripts;
      }
    }

    return file;
  };
});