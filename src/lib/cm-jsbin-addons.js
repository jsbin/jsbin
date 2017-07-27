import CodeMirror from 'codemirror';
import idk from 'idb-keyval';

CodeMirror.defineOption('fontSize', 13, function(cm, value) {
  value = parseFloat(value, 10);
  const style = document.createElement('style');
  style.innerHTML = `.CodeMirror { font-size: ${value}px; line-height: ${value *
    1.3}px; }`;
  document.head.appendChild(style);
});

CodeMirror.defineOption('lineHeight', function(cm, value) {
  value = parseFloat(value, 10);
  const style = document.createElement('style');
  style.innerHTML = `.CodeMirror, .Console { line-height: ${value}px; }`;
  document.head.appendChild(style);
});

CodeMirror.defineOption('fontFamily', '', function(cm, value) {
  if (!value.trim()) {
    return;
  }
  const style = document.createElement('style');
  style.innerHTML = `.CodeMirror, .Console, .CodeMirror-lint-tooltip { font-family: ${value}; }`;
  document.head.appendChild(style);
});

CodeMirror.defineExtension('snippets', async function({ cm }) {
  const pos = cm.getCursor();
  const tok = cm.getTokenAt(pos);
  const snippets = cm.getOption('snippets') || { cl: `console.log('$0');` };
  let macro = '';
  let targetCursorPos = -1;
  let tagName = tok.string;

  if (tok.end > pos.ch) {
    tagName = tagName.slice(0, tagName.length - tok.end + pos.ch);
  }

  const key = tagName.toLowerCase();

  if (snippets[key]) {
    let code = snippets[key];
    if (code.startsWith('@local/')) {
      const data = await idk.get(code.split('@local/').pop());
      code = data[cm.getOption('source')]; // NOTE: getOption('source') is bespoke to jsbin
    }

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
  }
  return CodeMirror.Pass;
});

CodeMirror.commands.snippets = function(cm) {
  cm.snippets({ cm });
};