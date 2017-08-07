import React from 'react';
import CodeMirror from 'react-codemirror';
import PropTypes from 'prop-types';
import { getConfig } from '../lib/processor';

import { cmCmd } from '../lib/is-mac';
import * as MODES from '../lib/cm-modes';

// import 'codemirror/addon/hint/show-hint.js';
// import 'codemirror/addon/hint/html-hint.js';
// import 'codemirror/addon/hint/css-hint.js';
// import '../lib/anyword-hint';

import 'codemirror/keymap/vim.js';
import 'codemirror/keymap/sublime.js';
import 'codemirror/keymap/emacs.js';

// import 'codemirror/addon/lint/lint.js';
// import 'codemirror/addon/lint/javascript-lint.js';

import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/edit/closebrackets';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml'; // html
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/display/autorefresh';

// JS Bin specific addons
import '../lib/CodeMirror/ext-formatter';
import '../lib/CodeMirror/cmd-dismiss';
import '../lib/CodeMirror/cmd-snippets';
import '../lib/CodeMirror/opt-styles';
import '../lib/CodeMirror/ext-highlight-lines';

import 'codemirror/lib/codemirror.css';
// import 'codemirror/addon/hint/show-hint.css';
import '../css/CodeMirror.css';

CodeMirror.displayName = 'CodeMirror';

export default class Mirror extends React.Component {
  constructor(props) {
    super(props);
    this.updateCode = this.updateCode.bind(this);
    this.onCursorActivity = this.onCursorActivity.bind(this);
    this.onChanges = this.onChanges.bind(this);

    this.refreshTimer = null;
    this.state = {
      code: props.code,
    };
  }

  onCursorActivity(cm) {
    // var shouldCloseAutocomplete = !(
    //   cursor.line === this._queryRange.startLine &&
    //   this._queryRange.startColumn <= cursor.ch &&
    //   cursor.ch <= this._queryRange.endColumn
    // );
  }

  onChanges(cm, changes) {
    if (!changes.length) return;
  }

  componentDidMount() {
    this.updateCursor(this.props);
    const cm = this.CodeMirror.getCodeMirror();
    cm.on('changes', this.onChanges);

    cm.on('highlightLines', () => {
      this.props.setHighlightedLines(cm.highlightLines().string || null);
    });
    cm.refresh();
  }

  componentWillUnmount() {
    if (this.errorMarker) {
      this.errorMarker.clear();
    }
    clearTimeout(this.refreshTimer);
  }

  componentWillReceiveProps(nextProps) {
    const { source } = this.props;
    const cm = this.CodeMirror.getCodeMirror();
    const { line, ch } = cm.getCursor();

    if (
      this.state.code !== nextProps.code &&
      this.props.code !== nextProps.code
    ) {
      this.setState({ code: nextProps.code });
      // FIXME I don't understand why I need to manually set this value since
      // react-codemirror already has these bits…
      cm.setValue(nextProps.code);
    }

    /**
     * if the source has changed, it means that we've changed panel and we
     * need to restore the code entirely and scrap the current state.
     * it also means we need to restore the cursor for this particular panel,
     * but first capturing the cursor position for the *current* panel.
     */
    if (source !== nextProps.source) {
      // firstly save the cursor position
      this.props.setCursor({ source, line, ch });
      this.updateCursor(nextProps);
    }

    // we listen for a dirty flag that triggers a CodeMirror repaint
    if (nextProps.session.dirty) {
      this.refresh();
      this.props.setDirtyFlag(false);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.focus !== this.props.focus) {
      this.CodeMirror.focus();
    }

    // we listen for a dirty flag that triggers a CodeMirror repaint
    if (this.dirty) {
      this.refresh();
      this.props.setDirtyFlag(false);
    }

    const { error, source } = this.props;
    if (this.errorMarker) {
      this.errorMarker.clear();
    }
    this.errorMarker = null;

    if (error) {
      let { message, line, ch } = error;
      line = line - 1;
      ch = ch - 1;
      const cm = this.CodeMirror.getCodeMirror();

      let element;
      if (this.errorMarker) {
        element = this.errorMarker.node.firstChild;
      } else {
        element = document.createElement('div');
        element.className = 'text-editor-line-decoration';
        element.innerHTML = `<div title="${message
          .split(':')
          .pop()
          .trim()}" class="text-editor-line-decoration-wave"></div>`;
      }

      const CM = this.CodeMirror.getCodeMirrorInstance();
      var base = cm.cursorCoords(CM.Pos(line, 0), 'page');
      var start = cm.cursorCoords(CM.Pos(line, ch), 'page');
      var end = cm.charCoords(CM.Pos(line, Infinity), 'page');
      element.style.width = end.right - start.left + 'px';
      element.style.left = start.left - base.left + 'px';

      if (!this.errorMarker) {
        this.errorMarker = cm.doc.addLineWidget(line, element);
      }
    }

    if (this.errorMarker) {
      this.errorMarker.node.hidden = source !== MODES.JAVASCRIPT;
    }

    // try to do auto complete on typing…
    // const autocomplete = debounce(cm => cm.execCommand('autocomplete'), 500);
    // this.CodeMirror.getCodeMirror().on('cursorActivity', autocomplete);
  }

  _shouldComponentUpdate(nextProps) {
    if (nextProps.dirty) {
      return false;
    }
    return true;
  }

  refresh() {
    this.refreshTimer = setTimeout(() => {
      this.CodeMirror.getCodeMirror().refresh();
    }, 0);
  }

  updateCursor(props) {
    if (props.setCursor) {
      const cm = this.CodeMirror.getCodeMirror();
      const [line, ch] = props.session[`cursor${props.source}`]
        .split(':')
        .map(_ => parseInt(_, 10));

      cm.setCursor({ line, ch });
    }
  }

  updateCode(code) {
    this.setState({ code });
    if (this.props.changeCode) {
      this.props.changeCode(code, this.props.source);
    }
  }

  render() {
    const { options, focus, editor, snippets, source, processor } = this.props;
    const { code } = this.state;

    const profiles = {
      html: 'xhtml',
      css: 'css',
      javascript: null,
    };

    const mode = options.mode || getConfig(processor).mode;

    const extraKeys = { [`${cmCmd}-S`]: 'noop', ...(editor.extraKeys || {}) };

    const cmOptions = {
      source,
      theme: this.props.app.theme,
      fixedGutter: true,
      dragDrop: false, // FIXME add the custom D&D support
      autoRefresh: true,
      autoCloseBrackets: true,
      hintOptions: {
        completeSingle: false,
      },
      snippets,
      profile: profiles[source],
      showInvisibles: true, // this extension is disabled
      highlightLine: true, // this extension is disabled
      flattenSpans: true,
      ...editor,
      ...options,
      extraKeys,
      mode,
    };

    return (
      <CodeMirror
        ref={e => (this.CodeMirror = e)}
        value={code}
        onCursorActivity={this.onCursorActivity}
        onChange={this.updateCode}
        options={cmOptions}
        autoFocus={focus}
      />
    );
  }
}

Mirror.propTypes = {
  code: PropTypes.string.isRequired,
  editor: PropTypes.object.isRequired,
  setCursor: PropTypes.func,
  setDirtyFlag: PropTypes.func,
  setHighlightedLines: PropTypes.func,
  session: PropTypes.object,
  changeCode: PropTypes.func,
  theme: PropTypes.string,
  options: PropTypes.object,
  focus: PropTypes.bool,
  app: PropTypes.object,
  snippets: PropTypes.object,
  dirty: PropTypes.bool,
  source: PropTypes.string,
};

Mirror.defaultProps = {
  source: 'html',
  dirty: false,
  snippets: null,
  focus: true,
  code: '',
  session: {},
};
