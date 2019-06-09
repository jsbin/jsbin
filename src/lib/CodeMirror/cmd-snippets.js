import CodeMirror from 'codemirror';
import idk from 'idb-keyval';

import * as MODES from '../cm-modes';

CodeMirror.defineExtension('snippets', function({ cm }) {
  const pos = cm.getCursor();
  const tok = cm.getTokenAt(pos);
  const snippets = cm.getOption('snippets') || { cl: `console.log('$0');` };
  let macro = '';
  let targetCursorPos = -1;
  let tagName = tok.string;

  if (tok.end > pos.ch) {
    tagName = tagName.slice(0, tagName.length - tok.end + pos.ch);
  }

  if (tagName === '') {
    return CodeMirror.Pass;
  }

  const key = tagName.toLowerCase();

  if (snippets[key]) {
    let code = snippets[key];
    let promise;
    if (code.startsWith('@local/')) {
      promise = idk.get(code.split('@local/').pop()).then(data => {
        // NOTE: getOption('source') is bespoke to jsbin
        return data[cm.getOption('source')];
      });
    } else {
      promise = Promise.resolve(code);
    }

    promise.then(code => {
      targetCursorPos = code.indexOf('$0');
      macro = code.replace(/\$0/, '');
      cm.replaceRange(
        macro,
        { line: pos.line, ch: pos.ch - key.length },
        { line: pos.line, ch: pos.ch + key.length }
      );

      if (targetCursorPos !== -1) {
        cm.setCursor({
          line: pos.line,
          ch: pos.ch - key.length + targetCursorPos,
        });
      }
      return;
    });
    return;
  }
  return CodeMirror.Pass;
});

CodeMirror.commands.snippets = function(cm) {
  const res = cm.snippets({ cm });
  const source = cm.getOption('source');

  if (res === CodeMirror.Pass && source !== MODES.JAVASCRIPT) {
    // try with emmet
    const isEmmet = CodeMirror.commands.emmetExpandAbbreviation(cm);
    // check if it's an empty tab or an emmet tab
    if (isEmmet === true) {
      return;
    }
  }
  return res;
};
