import React from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import Mirror from '../containers/Mirror';

import CodeSettings from '../containers/CodeSettings';
import Footer from '../containers/Footer';
import { Command, Shift } from './Symbols';

import '../css/Panel.css';

import * as MODES from '../lib/cm-modes';
import { cmd } from '../lib/is-mac';

const keyMap = {
  save: `${cmd}+s`,
  run: `${cmd}+enter`,
  html: `${cmd}+1`,
  css: `${cmd}+2`,
  javascript: `${cmd}+3`,
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.saveCode = this.saveCode.bind(this);

    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillReceiveProps() {
    let height = this.footer.offsetHeight;
    if (this.props.editor.vertical === true) {
      height += document.querySelector('.layout-pane-primary').offsetHeight;
    }
    this.setState({ height });
  }

  componentDidUpdate(prevProps) {
    // this.CodeMirror.getCodeMirror().execCommand('selectAll');
    if (prevProps.theme !== this.props.theme) {
      // load the CSS for the new theme
      this.loadTheme(this.props.theme);
    }
  }

  saveCode(e) {
    e.preventDefault(); // prevent showing the "save as" modal
    this.props.save();
  }

  render() {
    const { editor, source, code } = this.props;

    const options = {
      mode: source,
      fixedGutter: true,
      autoRefresh: true,
      ...editor,
    };

    if (source === MODES.HTML) {
      options.autoCloseTags = true;
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
          <Mirror
            changeCode={this.props.changeCode}
            ref={e => (this.Mirror = e)}
            focus={this.props.focus}
            code={code}
            options={options}
          />
          <div className="AppFooter" ref={e => (this.footer = e)}>
            <CodeSettings />
            <Footer>
              <p>
                Show all commands{' '}
                <kbd>
                  <Command /> <Shift /> P
                </kbd>
              </p>
            </Footer>
          </div>
        </div>
      </HotKeys>
    );
  }
}

Panel.propTypes = {
  source: PropTypes.string.isRequired,
  code: PropTypes.string,
  theme: PropTypes.string,
  editor: PropTypes.object,
  changeCode: PropTypes.func,
  onRef: PropTypes.func,
  setSource: PropTypes.func,
  focus: PropTypes.bool,
  setCursor: PropTypes.func,
  session: PropTypes.object,
  save: PropTypes.func,
};
