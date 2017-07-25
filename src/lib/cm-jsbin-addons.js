import CodeMirror from 'codemirror';

CodeMirror.defineOption('fontSize', 13, function(cm, value) {
  value = parseFloat(value, 10);
  const style = document.createElement('style');
  style.innerText = `.CodeMirror { font-size: ${value}px; line-height: ${value *
    1.3}px; }`;
  document.head.appendChild(style);
});
