import React from 'react';
import CodeMirror from 'react-codemirror';
import PropTypes from 'prop-types';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml'; // html
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/display/autorefresh';

import 'codemirror/lib/codemirror.css';
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
    const { theme } = this.props;
    if (theme !== 'default') {
      // lazy load the theme css
      this.loadTheme(theme);
    }

    this.updateCursor(this.props);
  }

  componentWillUnmount() {
    clearTimeout(this.refreshTimer);
  }

  componentWillReceiveProps(nextProps) {
    const { source } = this.props.editor;
    const cm = this.CodeMirror.getCodeMirror();
    if (source !== nextProps.editor.source) {
      // firstly save the cursor position
      this.props.setCursor({ source, ...cm.getCursor() });

      this.setState({ code: nextProps.code });
      // FIXME this is a hack, but don't understand why
      // react-codemirror already has the bits…
      cm.setValue(nextProps.code);

      this.updateCursor(nextProps);
    }

    // as usual with jsbin, we need a setTimeout to avoid a race on the
    // rendering of the codemirror instance
    if (nextProps.session.dirty) {
      this.refreshTimer = setTimeout(() => {
        this.CodeMirror.getCodeMirror().refresh();
        this.props.setDirtyFlag(false);
      }, 0);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.focus !== this.props.focus) {
      this.CodeMirror.focus();
    }
  }

  updateCursor(props) {
    const cm = this.CodeMirror.getCodeMirror();
    const [line, ch] = props.session[`cursor${props.editor.source}`]
      .split(':')
      .map(_ => parseInt(_, 10));
    cm.setCursor({ line, ch });
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
      this.props.changeCode(this.props.editor.source, code);
    }
  }

  render() {
    const { options, focus } = this.props;
    const { code } = this.state;
    return (
      <CodeMirror
        ref={e => (this.CodeMirror = e)}
        value={code}
        onChange={this.updateCode}
        options={options}
        autoFocus={focus}
      />
    );
  }
}

Mirror.propTypes = {
  code: PropTypes.string.isRequired,
  editor: PropTypes.object.isRequired,
  setCursor: PropTypes.func.isRequired,
  setDirtyFlag: PropTypes.func.isRequired,
  session: PropTypes.object,
  changeCode: PropTypes.func,
  theme: PropTypes.string,
  options: PropTypes.object,
  focus: PropTypes.bool,
};

Mirror.defaultProps = {
  theme: 'jsbin',
  focus: true,
  code: '',
};
