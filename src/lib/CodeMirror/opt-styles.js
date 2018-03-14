import CodeMirror from 'codemirror';

CodeMirror.defineOption('fontSize', 13, function(cm, value) {
  value = parseFloat(value, 10);
  const style = document.createElement('style');
  style.innerHTML = `.CodeMirror { font-size: ${value}px; line-height: ${value *
    1.3}px; } .CodeMirror-linenumber { line-height: ${value * 1.3}px }`;
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

CodeMirror.commands.noop = () => {};
