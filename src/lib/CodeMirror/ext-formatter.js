import CodeMirror from 'codemirror';

// FIXME I want to *only* use the HTML formatter, and then use prettier
// for js, CSS and JSON - but I need something working now, so this is a start.
import * as tidy from 'js-beautify';
tidy.javascript = tidy.js; // alias to allow our named sources to work

CodeMirror.defineExtension('autoFormat', cm => {
  let from, to;
  const doc = cm.doc;

  if (doc.somethingSelected()) {
    from = doc.getCursor('from');
    to = doc.getCursor('to');
  } else {
    from = { line: 0, ch: 0 };
    to = { line: doc.lineCount() - 1 }; // ch empty means to end of line
  }

  const code = doc.getRange(from, to);

  const res = tidy[cm.getOption('source')](code, {
    indent_size: cm.getOption('indentUnit'),
    indent_with_tabs: cm.getOption('indentWithTabs'),
  });

  const cursor = cm.getCursor();
  doc.replaceRange(res, from, to);
  cm.setCursor(cursor); // adjust for offset?
});

CodeMirror.commands.autoFormat = cm => cm.autoFormat(cm);
