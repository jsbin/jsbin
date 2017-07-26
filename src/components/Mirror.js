import React from 'react';
import CodeMirror from 'react-codemirror';
import PropTypes from 'prop-types';

// import 'codemirror/addon/hint/show-hint.js';
// import 'codemirror/addon/hint/html-hint.js';
// import 'codemirror/addon/hint/css-hint.js';
// import '../lib/anyword-hint';

// import 'cm-show-invisibles';

import '../lib/cm-jsbin-addons';

import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';

import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/edit/closebrackets';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml'; // html
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/display/autorefresh';

import 'codemirror/lib/codemirror.css';
// import 'codemirror/addon/hint/show-hint.css';
import '../css/CodeMirror.css';

CodeMirror.displayName = 'CodeMirror';
const STATIC = process.env.REACT_APP_STATIC;

export default class Mirror extends React.Component {
  constructor(props) {
    super(props);
    this.updateCode = this.updateCode.bind(this);

    this.refreshTimer = null;
    this.state = {
      code: props.code,
    };
  }

  componentDidMount() {
    const { theme } = this.props.app;
    if (theme !== 'default') {
      // lazy load the theme css
      this.loadTheme(theme);
    }

    this.updateCursor(this.props);
    this.CodeMirror.getCodeMirror().refresh();
  }

  componentWillUnmount() {
    clearTimeout(this.refreshTimer);
  }

  componentWillReceiveProps(nextProps) {
    const { source } = this.props.session;
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
    if (source !== nextProps.session.source) {
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

    const { theme } = this.props.app;
    if (theme !== prevProps.theme) {
      // lazy load the theme css
      this.loadTheme(theme);
    }

    // we listen for a dirty flag that triggers a CodeMirror repaint
    if (this.dirty) {
      this.refresh();
      this.props.setDirtyFlag(false);
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
      const [line, ch] = props.session[`cursor${props.session.source}`]
        .split(':')
        .map(_ => parseInt(_, 10));

      cm.setCursor({ line, ch });
    }
  }

  loadTheme(theme) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${STATIC}/cm-themes/${theme}.css`;
    document.head.appendChild(link);
  }

  updateCode(code) {
    this.setState({ code });
    if (this.props.changeCode) {
      this.props.changeCode(code, this.props.session.source);
    }
  }

  render() {
    const { options, focus, editor, snippets } = this.props;
    const { code } = this.state;

    const cmOptions = {
      theme: this.props.app.theme,
      fixedGutter: true,
      dragDrop: false, // FIXME add the custom D&D support
      autoRefresh: true,
      autoCloseBrackets: true,
      hintOptions: {
        completeSingle: false,
      },
      snippets: snippets,
      extraKeys: {
        Tab: 'snippets',
      },
      showInvisibles: true,
      ...editor,
      ...options,
    };

    return (
      <CodeMirror
        ref={e => (this.CodeMirror = e)}
        value={code}
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
  session: PropTypes.object,
  changeCode: PropTypes.func,
  theme: PropTypes.string,
  options: PropTypes.object,
  focus: PropTypes.bool,
  app: PropTypes.object,
  snippets: PropTypes.object,
  dirty: PropTypes.bool,
};

Mirror.defaultProps = {
  dirty: false,
  snippets: null,
  focus: true,
  code: '',
  session: {},
};
