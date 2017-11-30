import React from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import Mirror from '../containers/Mirror';

import CodeSettings from '../containers/CodeSettings';
import Footer from '../containers/Footer';
import { Command, Ctrl, Shift } from './Symbols';

import '../css/Panel.css';

import * as MODES from '../lib/cm-modes';
import { cmd } from '../lib/is-mac';

const PaletteShortcut = () =>
  <kbd>
    {window.navigator.userAgent.toLowerCase().includes('firefox')
      ? <Ctrl />
      : <Command />}{' '}
    <Shift /> P
  </kbd>;

const keyMap = {
  save: `mod+s`,
  update: `mod+enter`,
  html: `mod+1`,
  css: `mod+3`,
  javascript: `mod+2`,
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.saveCode = this.saveCode.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.triggerPalette = this.triggerPalette.bind(this);

    this.state = {
      height: 0,
    };
  }

  triggerPalette(e) {
    e.preventDefault();
    this.props.triggerPalette(true);
  }

  updateHeight() {
    let height = (this.footer ? this.footer : { offsetHeight: 0 }).offsetHeight;
    if (this.props.editor.splitColumns === true) {
      height += document.querySelector('.layout-pane-primary').offsetHeight;
    }
    this.setState({ height });
  }

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
    if (this.props.session.dirty) {
      this.updateHeight();
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillReceiveProps() {
    this.updateHeight();
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
      fixedGutter: true,
      autoRefresh: true,
      ...editor,
    };

    if (source === MODES.HTML) {
      options.autoCloseTags = true;
    }

    const setTo = source => e => {
      e.preventDefault();
      this.props.setSource(source);
    };

    const handlers = {
      save: this.saveCode,
      update: this.props.update,
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
                <button className="Button simple" onClick={this.triggerPalette}>
                  Show all commands
                  <PaletteShortcut />
                </button>
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
  triggerPalette: PropTypes.func,
};
