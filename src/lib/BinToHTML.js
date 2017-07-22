var doctypeRe = new RegExp(/^<!doctype[^>]*>\n?/im);

function hashof(string) {
  var hash = 0;
  var i = 0;
  var c = 0;

  if (string.length === 0) {
    return hash;
  }

  for (; i < string.length; i++) {
    c = string.charCodeAt(i);
    hash = (hash << 5) - hash + c;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash.toString(16);
}

function insert(source, needle, value) {
  if (source.toLowerCase().indexOf(needle.toLowerCase()) === -1) {
    return null;
  }

  var left = source.substring(
    0,
    source.toLowerCase().lastIndexOf(needle.toLowerCase())
  );
  var right = source.substring(
    source.toLowerCase().lastIndexOf(needle.toLowerCase())
  );
  var result = '';

  if (left && right) {
    result = left + value + right;
  }
  return result;
}

function safeForHTML(s) {
  return s.replace(/<\/script>/gi, '<\\/script>').replace(/<!--/g, '<\\!--');
}

export default function binToFile(bin, options) {
  if (!bin) {
    console.error('binToFile requires bin object', new Error().stack);
    return '<!DOCTYPE html>';
  }

  if (!options) {
    options = {};
  }

  // allows for the proto to be '' (not sure why you'd want that though...)
  var proto = options.proto !== undefined ? options.proto : 'http:';

  // protect myself from idoits, like me.
  if (proto && proto.slice(-1) !== ':') {
    proto += ':';
  }

  var file = '';
  var html = (bin.html || '').replace(/(\r\n)/g, '\n'); // remove windows nl.
  var source = bin.source;
  var css = safeForHTML(bin.css || '');
  var javascript = safeForHTML(bin.javascript || '');
  var processors = bin.processors || {};
  var meta =
    bin.meta ||
    (bin.url
      ? '<!-- source: http://jsbin.com/' +
        bin.url +
        '/' +
        (bin.revision || '') +
        ' -->\n'
      : '');

  // insert protocol if missing
  html = html.replace(/(src|href)=('|")\/\//g, '$1=$2' + proto + '//');

  // meta = meta + '<!--hash:' + bin.url + '/' + bin.revision + '/^^hash^^-->\n';

  if (meta && meta.slice(-1) !== '\n') {
    meta += '\n'; // a nice new line for the meta data
  }

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
      css = '<style id="jsbin-css">\n' + css + '\n</style>\n';
      var head = insert(file, '</head>', css);
      if (head) {
        file = head;
      } else {
        var title = insert(file, '</title>', css);
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
  var doctype =
    (html.trim().split('\n').shift().trim().match(doctypeRe) || [])[0] || '';

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
      javascript =
        '<script id="jsbin-javascript">\n' + javascript + '\n</script>';
      var body = insert(file, '</body>', javascript + '\n');
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
    if (source.css === css) {
      delete source.css;
    }
    if (source.javascript === javascript) {
      delete source.javascript;
    }
    if (source.html === html) {
      delete source.html;
    }

    var sourceScripts = ['html', 'css', 'javascript']
      .map(function(type) {
        if (source[type] === undefined) {
          return '';
        }

        var content = safeForHTML(source[type]);
        if (content) {
          return (
            '\n<script id="jsbin-source-' +
            type +
            '" type="text/' +
            (processors[type] || type) +
            '">' +
            content +
            '</script>'
          );
        }
      })
      .join('\n');

    var bodytag = insert(file, '</body>', sourceScripts);
    if (bodytag) {
      file = bodytag;
    } else {
      file += sourceScripts;
    }
  }

  var signature = hashof(file);
  file = file.split('^^hash^^').join(signature);

  return file;
}
