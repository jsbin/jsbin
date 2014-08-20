(function(mod) {
  if (typeof exports == 'object' && typeof module == 'object') // CommonJS
    mod(require('../../lib/codemirror'));
  else if (typeof define == 'function' && define.amd) // AMD
    define(['../../lib/codemirror'], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  'use strict';
  var GUTTER_ID = 'CodeMirror-lint-markers';
  var SEVERITIES = /^(?:error|warning)$/;

  function showTooltip(e, content) {
    var tt = document.createElement('div');
    tt.className = 'CodeMirror-lint-tooltip';
    tt.appendChild(content.cloneNode(true));
    document.body.appendChild(tt);

    function position(e) {
      if (!tt.parentNode) return CodeMirror.off(document, 'mousemove', position);
      tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + 'px';
      tt.style.left = (e.clientX + 5) + 'px';
    }
    CodeMirror.on(document, 'mousemove', position);
    position(e);
    if (tt.style.opacity != null) tt.style.opacity = 1;
    return tt;
  }
  function rm(elt) {
    if (elt.parentNode) elt.parentNode.removeChild(elt);
  }
  function hideTooltip(tt) {
    if (!tt.parentNode) return;
    if (tt.style.opacity == null) rm(tt);
    tt.style.opacity = 0;
    setTimeout(function() { rm(tt); }, 600);
  }

  function showTooltipFor(e, content, node) {
    var tooltip = showTooltip(e, content);
    function hide() {
      CodeMirror.off(node, 'mouseout', hide);
      if (tooltip) { hideTooltip(tooltip); tooltip = null; }
    }
    var poll = setInterval(function() {
      if (tooltip) for (var n = node;; n = n.parentNode) {
        if (n == document.body) return;
        if (!n) { hide(); break; }
      }
      if (!tooltip) return clearInterval(poll);
    }, 400);
    CodeMirror.on(node, 'mouseout', hide);
  }

  function LintState(cm, options, hasGutter) {
    this.lineWidgets = [];
    this.marked = [];
    this.options = options;
    this.timeout = null;
    this.hasGutter = hasGutter;
    this.onMouseOver = function(e) { onMouseOver(cm, e); };
  }

  function parseOptions(cm, options) {
    if (options instanceof Function) return {getAnnotations: options};
    if (!options || options === true) options = {};
    if (!options.getAnnotations) options.getAnnotations = cm.getHelper(CodeMirror.Pos(0, 0), 'lint');
    if (!options.getAnnotations && cm.getOption('mode') === 'htmlmixed') {
      options.getAnnotations = CodeMirror.helpers.lint.htmlmixed;
    }
    if (!options.getAnnotations && cm.getOption('mode') === 'coffeescript') {
      options.getAnnotations = CodeMirror.helpers.lint.coffeescript;
    }
    // if (!options.getAnnotations) throw new Error('Required option "getAnnotations" missing (lint addon)');
    if (!options.getAnnotations) {
      options.getAnnotations = function() { return []; };
    }
    return options;
  }

  function underClear(cm) {
    var state = cm.state.lint;
    for (var i = 0; i < state.marked.length; ++i)
      state.marked[i].clear();
    state.marked.length = 0;
  }

  function gutterMarkerDraw(labels, severity, multiple, tooltip) {
    var marker = document.createElement('div'), inner = marker;
    marker.className = 'CodeMirror-lint-marker-' + severity;
    if (multiple) {
      inner = marker.appendChild(document.createElement('div'));
      inner.className = 'CodeMirror-lint-marker-multiple';
    }

    if (tooltip) {
      CodeMirror.on(inner, 'mouseover', function(e) {
        showTooltipFor(e, labels, inner);
      });
    }

    return marker;
  }

  function getMaxSeverity(a, b) {
    if (a == 'error') return a;
    else return b;
  }

  function groupByLine(annotations) {
    var lines = [];
    for (var i = 0; i < annotations.length; ++i) {
      var ann = annotations[i], line = ann.from.line;
      (lines[line] || (lines[line] = [])).push(ann);
    }
    return lines;
  }

  function annotationTooltip(ann, severity) {
    var tip = document.createElement('div');
    tip.className = 'CodeMirror-lint-message-' + severity;
    tip.appendChild(document.createTextNode(ann.message));
    return tip;
  }

  function gutterDraw(line, tipLabel, maxSeverity, anns, state, cm) {
    cm.setGutterMarker(line, GUTTER_ID, gutterMarkerDraw(tipLabel, maxSeverity, anns.length > 1, cm.options.lintOpt.tooltip));
  }

  function gutterReset(cm) {
    cm.clearGutter(GUTTER_ID);
  }

  function underDraw(ann, severity, state, cm) {
    state.marked.push(cm.markText(ann.from, ann.to, {
      className: 'CodeMirror-lint-mark-' + severity,
      __annotation: ann
    }));
  }

  function consoleInit(cm) {
    var wrapper = document.createElement('details');
    var head = document.createElement('summary');
    var logs = document.createElement('div');
    wrapper.className = 'console-wrapper';
    head.className = 'console-log-head';
    logs.className = 'console-log';
    wrapper.appendChild(head);
    wrapper.appendChild(logs);
    cm.consolelint = {
      wrapper: wrapper,
      logs: logs,
      head: head,
      error: 0,
      warning: 0
    };
    cm.options.lintOpt.consoleParent.appendChild(wrapper);
    CodeMirror.on(logs, 'click', function(event) {
      consoleClick(event, cm);
    });
  }

  function consoleLine(ann, severity, cm) {
    cm.consolelint[severity]++;
    var line = document.createElement('div');
    line.className = 'console-log-line lint-icon-' + severity;
    line.setAttribute('data-ch', ann.from.ch);
    line.setAttribute('data-line', ann.from.line);
    line.setAttribute('data-reason', ann.message);
    line.appendChild(document.createTextNode('Line ' + (ann.from.line + 1) + ': ' + ann.message));
    return line;
  }

  function consoleReset(cm) {
    cm.consolelint.error = 0;
    cm.consolelint.warning = 0;
    cm.consolelint.logs.innerHTML = '';
  }

  function consoleHeadUpdate(cm) {
    var counterEclass = '';
    var counterWclass = '';
    var es = 's';
    var ws = 's';
    if (cm.consolelint.error === 0) counterEclass = ' dis';
    if (cm.consolelint.warning === 0) counterWclass = ' dis';
    if (cm.consolelint.error === 1) es = '';
    if (cm.consolelint.warning === 1) ws = '';
    cm.consolelint.head.innerHTML = '';
    if (counterEclass && counterWclass) {
      cm.consolelint.head.style.display = 'none';
      cm.consolelint.logs.style.display = 'none';
      $document.trigger('sizeeditors');
      return;
    }
    cm.consolelint.head.style.display = '';
    cm.consolelint.logs.style.display = '';
    if (!counterEclass) {
      cm.consolelint.head.innerHTML += '<i class="lint-icon-error' + counterEclass + '"></i> ' +
        cm.consolelint.error + ' error' + es + ' ';
    }
    if (!counterWclass) {
      cm.consolelint.head.innerHTML += '<i class="lint-icon-warning' + counterWclass + '"></i> ' +
      cm.consolelint.warning + ' warning' + ws;
    }
    $document.trigger('sizeeditors');
  }

  function consoleClick(event, cm) {
    var target = event.target;
    if (target.className.indexOf('console-log-line') !== -1) {
      var ch = target.getAttribute('data-ch') * 1;
      var line = target.getAttribute('data-line') * 1;
      var reason = target.getAttribute('data-reason');
      var lineHeight = cm.defaultTextHeight();
      cm.setCursor({ line: line, ch: ch });
      cm.scrollIntoView(null, lineHeight * 3);
      cm.focus();

      var old = document.getElementById('console-log-line-selected');
      if (old) {
        old.id = '';
      }
      target.id = 'console-log-line-selected';

      if (cm.options.lintOpt.line) {
        lineUpdate({ reason: reason, line: line }, cm);
      }
    }
  }

  function lineUpdate(ann, cm) {
    lineReset(cm);
    var msg = document.createElement('div');
    msg.appendChild(document.createTextNode(ann.reason));
    msg.className = 'lint-error';
    cm.state.lint.lineWidgets.push(cm.addLineWidget(ann.line * 1, msg, { coverGutter: false, noHScroll: true }));
  }

  function lineReset(cm) {
    var lineWidgets = cm.state.lint.lineWidgets;
    for (var i = 0; i < lineWidgets.length; ++i) {
      cm.removeLineWidget(lineWidgets[i]);
    }
    lineWidgets.length = 0;
  }

  function startLinting(cm) {
    var state = cm.state.lint, options = state.options;
    if (options.async)
      options.getAnnotations(cm, updateLinting, cm.options.lintRules);
    else
      updateLinting(cm, options.getAnnotations(cm.getValue(), cm.options.lintRules));
  }

  function updateLinting(cm, annotationsNotSorted) {
    var state = cm.state.lint, options = state.options;

    cm.state.lint.annotations = annotationsNotSorted;

    if (cm.options.lintOpt.under) {
      underClear(cm);
    }

    if (state.hasGutter) {
      gutterReset(cm);
    }

    var annotations = groupByLine(annotationsNotSorted);

    if (cm.options.lintOpt.console) {
      consoleReset(cm);
      if (cm.options.lintOpt.line) {
        lineReset(cm);
      }
    }

    for (var line = 0; line < annotations.length; ++line) {
      var anns = annotations[line];
      if (!anns) continue;

      var maxSeverity = null;
      var tipLabel = state.hasGutter && document.createDocumentFragment();

      for (var i = 0; i < anns.length; ++i) {
        var ann = anns[i];
        var severity = ann.severity;
        if (!SEVERITIES.test(severity)) severity = 'error';
        maxSeverity = getMaxSeverity(maxSeverity, severity);

        if (options.formatAnnotation) ann = options.formatAnnotation(ann);

        if (state.hasGutter) {
          tipLabel.appendChild(annotationTooltip(ann, severity));
        }

        if (cm.options.lintOpt.console) {
          cm.consolelint.logs.appendChild(consoleLine(ann, severity, cm));
        }

        if (cm.options.lintOpt.under) {
          if (ann.to) {
            underDraw(ann, severity, state, cm);
          }
        }
      }

      if (state.hasGutter) {
        gutterDraw(line, tipLabel, maxSeverity, anns, state, cm);
      }
    }
    if (options.onUpdateLinting) options.onUpdateLinting(annotationsNotSorted, annotations, cm);

    if (cm.options.lintOpt.console) {
      consoleHeadUpdate(cm);
    }
  }

  function onChange(cm) {
    var state = cm.state.lint;
    clearTimeout(state.timeout);
    state.timeout = setTimeout(function(){startLinting(cm);}, state.options.delay || 500);
  }

  function popupSpanTooltip(ann, e) {
    var target = e.target || e.srcElement;
    showTooltipFor(e, annotationTooltip(ann), target);
  }

  // When the mouseover fires, the cursor might not actually be over
  // the character itself yet. These pairs of x,y offsets are used to
  // probe a few nearby points when no suitable marked range is found.
  var nearby = [0, 0, 0, 5, 0, -5, 5, 0, -5, 0];

  function onMouseOver(cm, e) {
    if (!/\bCodeMirror-lint-mark-/.test((e.target || e.srcElement).className)) return;
    for (var i = 0; i < nearby.length; i += 2) {
      var spans = cm.findMarksAt(cm.coordsChar({left: e.clientX + nearby[i],
                                                top: e.clientY + nearby[i + 1]}, 'client'));
      for (var j = 0; j < spans.length; ++j) {
        var span = spans[j], ann = span.__annotation;
        if (ann) return popupSpanTooltip(ann, e);
      }
    }
  }

  function lintStop(cm) {
    lineReset(cm);
    cm.setOption('lint', false);
    var opt = cm.getOption('lintOpt');
    if (opt.gutter) {
      var gutters = cm.getOption('gutters');
      var pos = gutters.indexOf('CodeMirror-lint-markers');
      if (pos !== -1) {
        gutters.splice(pos, 1);
        cm.setOption('gutters', gutters);
        var ln = cm.getOption('lineNumbers');
        cm.setOption('lineNumbers', !ln);
        cm.setOption('lineNumbers', ln);
      }
    }
    if (opt.console) {
      opt.consoleParent.removeChild(cm.consolelint.wrapper);
      $document.trigger('sizeeditors');
    }
    cm.refresh();
  }

  CodeMirror.defineOption('lint', false, function(cm, val, old) {
    var defaults = {
      console: true,
      consoleParent: cm.getWrapperElement().parentNode,
      line: true,
      under: true,
      tooltip: true
    };
    if (!cm.options.lintOpt) {
      cm.options.lintOpt = {};
    }
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        cm.options.lintOpt[key] = (cm.options.lintOpt[key] !== undefined) ? cm.options.lintOpt[key] : defaults[key];
      }
    }

    if (!cm.options.lintRules) {
      cm.options.lintRules = {};
    }

    if (old && old != CodeMirror.Init) {
      if (cm.options.lintOpt.under) {
        underClear(cm);
      }

      if (cm.state.lint.hasGutter) {
        gutterReset(cm);
      }

      cm.off('change', onChange);
      CodeMirror.off(cm.getWrapperElement(), 'mouseover', cm.state.lint.onMouseOver);
      delete cm.state.lint;
    }

    if (val) {
      var gutters = cm.getOption('gutters'), hasLintGutter = false;
      for (var i = 0; i < gutters.length; ++i) if (gutters[i] == GUTTER_ID) hasLintGutter = true;
      var state = cm.state.lint = new LintState(cm, parseOptions(cm, val), hasLintGutter);
      cm.on('change', onChange);

      if (cm.options.lintOpt.console) {
        consoleInit(cm);
      }

      if (cm.options.lintOpt.tooltip)
        CodeMirror.on(cm.getWrapperElement(), 'mouseover', state.onMouseOver);

      startLinting(cm);

      cm.lintStop = function() {
        return lintStop(this);
      };
    }

    // probably to improve according to real case scenarios
    cm.updateLinting = function(annotationsNotSorted) {
      updateLinting(cm, annotationsNotSorted);
    };
  });
});
