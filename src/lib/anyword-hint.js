// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Modified by Remy Sharp 2017-07-24

import CodeMirror from 'codemirror/lib/codemirror';

var WORD = /[\w$]+/,
  RANGE = 500;

CodeMirror.registerHelper('hint', 'auto', function(editor, options) {
  var word = (options && options.word) || WORD;
  var range = (options && options.range) || RANGE;
  var cur = editor.getCursor(),
    curLine = editor.getLine(cur.line);
  var end = cur.ch,
    start = end;
  while (start && word.test(curLine.charAt(start - 1))) --start;
  var curWord = start !== end && curLine.slice(start, end);

  // RS: we do an early exit in two cases:
  // 1: if there cursor is not inside a word already
  // 2: if there's something already after the cursor
  if (curWord === false || curLine.charAt(end).trim() !== '') {
    return;
  }

  console.log('curWord', curWord);

  // also return if the next character isn't empty

  // if (!curWord) return;

  var list = (options && options.list) || [],
    seen = {};
  var re = new RegExp(word.source, 'g');
  for (var dir = -1; dir <= 1; dir += 2) {
    var line = cur.line;
    var endLine =
      Math.min(
        Math.max(line + dir * range, editor.firstLine()),
        editor.lastLine()
      ) + dir;
    for (; line !== endLine; line += dir) {
      const text = editor.getLine(line);
      let m;
      while ((m = re.exec(text))) {
        if (line === cur.line && m[0] === curWord) continue;
        if (
          (!curWord || m[0].lastIndexOf(curWord, 0) === 0) &&
          !Object.prototype.hasOwnProperty.call(seen, m[0])
        ) {
          seen[m[0]] = true;
          list.push(m[0]);
        }
      }
    }
  }
  return {
    list: list,
    from: CodeMirror.Pos(cur.line, start),
    to: CodeMirror.Pos(cur.line, end),
  };
});
