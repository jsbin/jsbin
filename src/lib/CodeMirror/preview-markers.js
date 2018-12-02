import CodeMirror from 'codemirror';

const regexp = new RegExp(`//\\s*?`, 'g'); // get a singleton copy

const previews = {};

CodeMirror.defineOption('preview', false, function(cm, value) {
  if (value === false) {
    cm.off('change', trackPreviewMarkers);
    return;
  }

  cm.on('change', trackPreviewMarkers);
});

CodeMirror.defineExtension('updatePreview', function(id, value) {
  if (previews[id]) {
    previews[id].dataset.value = value;
  }
});

function trackPreviewMarkers(cm, changes) {
  const { from, to } = changes;
  cm.startOperation();
  addPreviewMarker(cm, from, to);
  cm.endOperation();
}

export function findMarks(cm, from, to = from) {
  return cm
    .findMarks(
      new CodeMirror.Pos(from, 'before'),
      new CodeMirror.Pos(to, 'after')
    )
    .filter(m => m.__type === 'previewMarker');
}

function addPreviewMarker(cm, from, to) {
  const markers = findMarks(cm, from.line, to.line);
  markers.forEach(marker => marker.clear());

  for (let line = from.line; line <= to.line; line++) {
    const text = cm.getLine(line) || '';

    let res = regexp.exec(text.toLowerCase());

    while (res) {
      const ch = res.index;

      const widget = document.createElement('span');
      widget.id = `live-preview${line}`;
      widget.className = 'widget-preview';
      widget.dataset.value = '';

      previews[line] = widget;

      // FIXME I'd rather _update_ the widget, than remove and add
      const marker = cm.setBookmark({ line, ch: ch + 10 }, { widget });
      marker.__type = 'previewMarker';

      res = regexp.exec(text);
    }
    regexp.lastIndex = 0; // reset the regexp once done to reuse it later
  }
}
