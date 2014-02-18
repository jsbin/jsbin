window.record = (function () {
  'use strict';
  /* global jsbin:true */
  var history = [];
  var recording = false;
  var last = null;

  jsbin.panels.allEditors(function (panel) {
    panel.editor.on('change', function codeChange(cm, changeObj) {
      if (recording && changeObj.origin !== 'setValue') {
        history.push({
          time: Date.now(),
          panel: panel.id,
          type: 'change',
          change: changeObj
        });
      }
    });
    panel.editor.on('cursorActivity', function codeChange(cm) {
      if (recording) {
        history.push({
          time: Date.now(),
          panel: panel.id,
          type: 'cursor',
          head: cm.getCursor('head'),
          anchor: cm.getCursor('anchor')
        });
      }
    });
  });

  function play(i, speed) {
    var entry = history.slice(i, i + 1)[0];
    var next = (history.slice(i + 1, i + 2) || [null])[0];
    var editor = jsbin.panels.panels[entry.panel].editor;

    if (entry.type === 'change') {
      editor.replaceRange(entry.change.text.join('\n'), entry.change.from, entry.change.to);
    } else if (entry.type === 'cursor') {
      editor.setSelection(entry.anchor, entry.head);
    }

    if (next) {
      setTimeout(play.bind(null, i+1, speed), (next.time - entry.time) / speed);
    } else {
      jsbin.saveDisabled = last;
    }
  }

  function rewind(i, speed) {
    var entry = history.slice(i, i + 1)[0];
    var next = (history.slice(i - 1, i) || [null])[0];
    var editor = jsbin.panels.panels[entry.panel].editor;

    if (entry.type === 'change') {
      editor.replaceRange(entry.change.removed.join('\n'), entry.change.to, entry.change.from);
    } else if (entry.type === 'cursor') {
      editor.setSelection(entry.anchor, entry.head);
    }

    if (next) {
      setTimeout(rewind.bind(null, i-1, speed), (entry.time - next.time) / speed);
    } else {
      console.log('done rewind');
      jsbin.saveDisabled = last;
    }
  }

  var control = {
    start: function () {
      recording = true;
    },
    stop: function () {
      recording = false;
      control.save();
    },
    rewind: function () {
      control.stop();
      last = jsbin.saveDisabled;
      jsbin.saveDisabled = true;
      rewind(history.length - 1, 1);
    },
    play: function () {
      control.stop();
      last = jsbin.saveDisabled;
      jsbin.saveDisabled = true;
      play(0, 2);
    },
    save: function () {
      localStorage.record = JSON.stringify(history);
    },
    restore: function () {
      history = JSON.parse(localStorage.record || '[]');
    },
    history: function () {
      return history;
    }
  };

  return control;
})();

//window.record.start();