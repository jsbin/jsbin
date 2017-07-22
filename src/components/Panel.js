import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';
import { HotKeys } from 'react-hotkeys';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml'; // html
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/display/autorefresh';

import CodeSettings from '../containers/CodeSettings';
import Footer from './Footer';

import 'codemirror/lib/codemirror.css';
import '../css/Panel.css';
import '../css/CodeMirror.css';

import * as MODES from '../lib/cm-modes';
import { cmd } from '../lib/is-mac';

CodeMirror.displayName = 'CodeMirror';

const keyMap = {
  save: `${cmd}+s`,
  run: `${cmd}+enter`,
  html: `${cmd}+1`,
  css: `${cmd}+2`,
  javascript: `${cmd}+3`,
};

const STATIC = process.env.REACT_APP_STATIC;

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.updateCode = this.updateCode.bind(this);
    this.loadTheme = this.loadTheme.bind(this);
    this.saveCode = this.saveCode.bind(this);
    this.refresh = this.refresh.bind(this);

    this.state = {
      code: props.code,
      height: 0,
    };
  }

  refresh() {
    // as usual with jsbin, we need a setTimeout to avoid a race on the
    // rendering of the codemirror instance
    setTimeout(() => {
      this.CodeMirror.getCodeMirror().refresh();
      // this.CodeSettings.refresh();
    }, 0);

    const height = this.footer.offsetHeight;
    this.setState({ height });
  }

  loadTheme(theme) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${STATIC}/cm-themes/${theme}.css`;
    document.head.appendChild(link);
  }

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
    const { theme } = this.props.editor;
    if (theme !== 'default') {
      // lazy load the theme css
      this.loadTheme(theme);
    }

    this.refresh();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.source !== nextProps.source) {
      this.setState({ code: nextProps.code });
      // FIXME this is a hack, but don't understand why
      // react-codemirror already has the bits…
      this.CodeMirror.getCodeMirror().setValue(nextProps.code);
    }

    const height = this.footer.offsetHeight;
    this.setState({ height });
  }

  componentDidUpdate(prevProps) {
    // this.CodeMirror.getCodeMirror().execCommand('selectAll');
    if (prevProps.theme !== this.props.theme) {
      // load the CSS for the new theme
      this.loadTheme(this.props.theme);
    }

    if (prevProps.focus !== this.props.focus) {
      this.CodeMirror.focus();
    }
  }

  updateCode(code) {
    this.setState({ code });
    this.props.changeCode(code);
  }

  saveCode(e) {
    e.preventDefault(); // prevent showing the "save as" modal
    this.props.changeCode(this.state.code);
  }

  render() {
    const { editor, source } = this.props;
    const { code } = this.state;

    const options = {
      mode: source,
      fixedGutter: true,
      autoRefresh: true,
      ...editor,
    };

    if (source === MODES.HTML) {
      options.mode = {
        name: 'htmlmixed',
        scriptTypes: [
          {
            matches: /\/x-handlebars-template|\/x-mustache/i,
            mode: null,
          },
        ],
      };
    }

    const setTo = source => e => {
      e.preventDefault();
      this.props.setSource(source);
    };

    const handlers = {
      save: this.saveCode,
      run: this.saveCode,
      html: setTo(MODES.HTML),
      javascript: setTo(MODES.JAVASCRIPT),
      css: setTo(MODES.CSS),
    };

    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <div
          style={{
            paddingBottom: `calc(100vh - ${this.state.height + 20 + 0}px)`,
          }}
          ref={e => (this.el = e)}
          className="Panel"
        >
          <CodeMirror
            ref={e => (this.CodeMirror = e)}
            value={code}
            onChange={this.updateCode}
            options={options}
            autoFocus={this.props.focus}
          />
          <div ref={e => (this.footer = e)}>
            <CodeSettings />
            <Footer />
          </div>
        </div>
      </HotKeys>
    );
  }
}

Panel.propTypes = {
  mode: PropTypes.string.isRequired,
  code: PropTypes.string,
  theme: PropTypes.string,
  source: PropTypes.string,
  editor: PropTypes.object,
  changeCode: PropTypes.func,
  onRef: PropTypes.func,
  setSource: PropTypes.func,
  focus: PropTypes.bool,
};
