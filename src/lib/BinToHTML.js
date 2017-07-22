var doctypeRe = new RegExp(/^<!doctype[^>]*>\n?/im);

function hashOf(string) {
  let hash = 0;

  if (string.length === 0) {
    return hash;
  }

  for (let i = 0; i < string.length; i++) {
    const c = string.charCodeAt(i);
    hash = (hash << 5) - hash + c;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash.toString(16);
}

function insert(source, needle, value) {
  needle = needle.toLowerCase();
  const sourceLC = source.toLowerCase();
  if (!source.toLowerCase().includes(needle)) {
    return null;
  }

  const left = source.substring(0, sourceLC.lastIndexOf(needle));
  const right = source.substring(sourceLC.lastIndexOf(needle));

  if (left && right) {
    return left + value + right;
  }
  return '';
}

function safeForHTML(s = '') {
  return s.replace(/<\/script>/gi, '<\\/script>').replace(/<!--/g, '<\\!--');
}

export default function binToFile(bin, options = {}) {
  if (!bin) {
    console.error('binToFile requires bin object', new Error().stack);
    return '<!DOCTYPE html>';
  }

  // allows for the proto to be '' (not sure why you'd want that though...)
  let proto = options.proto !== undefined ? options.proto : 'https:';

  // protect myself from idiots, like me.
  if (proto && proto.slice(-1) !== ':') {
    proto += ':';
  }

  let file = '';
  let html = (bin.html || '').replace(/(\r\n)/g, '\n'); // remove windows nl.
  var css = safeForHTML(bin.css);
  var javascript = safeForHTML(bin.javascript);
  const { source, processors = {} } = bin;
  let meta =
    bin.meta ||
    (bin.url
      ? `<!-- source: http://jsbin.com/${bin.url}/${bin.revision || ''} -->\n`
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
    if (file.includes('%css%')) {
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
    if (file.includes('%code%')) {
      file = file.split('%code%').join(javascript);
    } else {
      // is there head tag?
      javascript = `<script id="jsbin-javascript">${javascript}\n</script>`;
      const body = insert(file, '</body>', javascript + '\n');
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

    const sourceScripts = ['html', 'css', 'javascript']
      .map(type => {
        if (source[type] === undefined) {
          return '';
        }

        const content = safeForHTML(source[type]);
        if (content) {
          return `\n<script id="jsbin-source-${type}" type="text/${processors[
            type
          ] || type}">${content}\n</script>`;
        }

        return '';
      })
      .join('\n');

    const bodyTag = insert(file, '</body>', sourceScripts);
    if (bodyTag) {
      file = bodyTag;
    } else {
      file += sourceScripts;
    }
  }

  file = file.split('^^hash^^').join(hashOf(file));

  return file;
}
