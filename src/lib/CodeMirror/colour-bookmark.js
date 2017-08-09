import CodeMirror from 'codemirror';
import * as colours from '../common/colours';
const regexp = colours.regexp(); // get a singleton copy

CodeMirror.defineOption('colours', false, function(cm, value) {
  if (value === false) {
    cm.off('change', trackColourChanges);
    return;
  }

  cm.on('change', trackColourChanges);
});

function trackColourChanges(cm, changes) {
  const { from, to } = changes;
  cm.startOperation();
  addSwatchMark(cm, from, to);
  cm.endOperation();
}

export function findMarks(cm, from, to = from) {
  return cm.findMarks(
    new CodeMirror.Pos(from, 'before'),
    new CodeMirror.Pos(to, 'after')
  );
}

function addSwatchMark(cm, from, to) {
  const markers = findMarks(cm, from.line, to.line);
  markers.forEach(marker => marker.clear());

  for (let line = from.line; line <= to.line; line++) {
    const text = cm.getLine(line) || '';

    let res = regexp.exec(text.toLowerCase());

    while (res) {
      const colour = res[1];
      const ch = res.index;

      const widget = document.createElement('span');
      widget.className = 'widget-colour';

      widget.style.backgroundColor = colour;

      // FIXME I'd rather _update_ the widget, than remove and add
      cm.setBookmark({ line, ch }, { widget });

      widget.onclick = e => {
        CodeMirror.signal(cm, 'openSwatch', cm, colour, e, { line, ch });
      };
      res = regexp.exec(text);
    }
    regexp.lastIndex = 0; // reset the regexp once done to reuse it later
  }
}
