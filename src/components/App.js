import React, { Component } from 'react';
// use a custom splitter as I've added an onSize event
import Splitter from '@remy/react-splitter-layout';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import idk from 'idb-keyval'; // FIXME lazy load candidate

import { getFromGist } from '../lib/Api';
import * as OUTPUT from '../actions/session';
import Panel from '../containers/Panel';
import Output from '../containers/Output';
import Head from './Head';
import Palette from '../containers/Palette';
import Loading from './Loading';
import Error from './GenericErrorPage';
import { SET_HTML } from '../actions/bin';

import '@remy/react-splitter-layout/src/stylesheets/index.css';
import '../css/App.css';

const noop = () => {};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.triggerPalette = this.triggerPalette.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.insertCode = this.insertCode.bind(this);
  }

  componentWillMount() {
    const { match } = this.props;

    if (match.params.localId) {
      idk.get(match.params.localId).then(res => {
        this.props.setBin(res);
      });
      return;
    }

    if (match.params.gistId) {
      getFromGist(match.params.gistId).then(res => {
        this.props.setBin(res);
      });
      return;
    }

    if (!match.params.bin) {
      // new bin
      // dispatch request for default bin
      this.props.loadDefault();
      return;
    }

    this.props.fetch(match.params);
  }

  insertCode(string) {
    let html = this.props.bin.html;
    const closeHeadIndex = html
      .toLowerCase()
      .split('\n')
      .find(line => line.includes('</head'));

    if (closeHeadIndex) {
      const codeLines = html.split(closeHeadIndex);
      html = codeLines.join(string + '\n' + closeHeadIndex);
    } else {
      // add to the start of the doc
      html = string + '\n' + html;
    }

    this.props.setCode(html, SET_HTML);
    const [line, ch] = this.props.session.cursorhtml.split(':');
    this.props.setCursor('html', line + 1, ch);
  }

  dismiss(e) {
    e.preventDefault();
    this.props.dismiss();
  }

  triggerPalette(e) {
    e.preventDefault();
    this.props.triggerPalette(true);
  }

  componentDidUpdate(prevProps) {
    const { editor } = this.props;
    if (
      editor.output !== prevProps.editor.output ||
      editor.vertical !== prevProps.editor.vertical
    ) {
      this.props.setDirtyFlag();
      return;
    }

    if (prevProps.loading === false && this.props.loading === true) {
      const { match } = this.props;
      if (!match.params.bin) {
        // new bin
        // dispatch request for default bin
        this.props.loadDefault();
        return;
      }

      this.props.fetch(match.params);
    }
  }

  componentDidMount() {
    this.props.setDirtyFlag();
  }

  render() {
    const {
      bin,
      loading,
      session,
      splitterWidth,
      vertical,
      theme,
    } = this.props;

    if (loading) {
      return (
        <div className={`JsBinApp loading theme-${theme}`}>
          <Head />
          <Loading />
        </div>
      );
    }

    if (bin.error) {
      return <Error status={bin.error} />;
    }

    const keyMap = {
      // intentionally supporting both
      openPalette: [`command+shift+p`, `ctrl+shift+p`],
      dismiss: 'escape',
    };

    const handlers = {
      openPalette: this.triggerPalette,
      dismiss: this.dismiss,
    };

    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <div className={`JsBinApp theme-${theme}`}>
          {session.palette && <Palette insert={this.insertCode} />}
          <Head />
          <div>
            <Splitter
              vertical={vertical}
              percentage={true}
              secondaryInitialSize={100 - splitterWidth}
              primaryIndex={0}
              onSize={size => {
                this.props.setSplitterWidth(size);
              }}
            >
              <Panel
                focus={!session.palette}
                onRef={ref => (this.panel = ref)}
              />
              {session.output !== OUTPUT.OUTPUT_NONE &&
                <Output output={session.output} />}
            </Splitter>
          </div>
        </div>
      </HotKeys>
    );
  }
}

App.propTypes = {
  bin: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  match: PropTypes.object,
  session: PropTypes.object,
  editor: PropTypes.object,
  setCode: PropTypes.func,
  fetch: PropTypes.func,
  loadDefault: PropTypes.func,
  setSource: PropTypes.func,
  triggerPalette: PropTypes.func,
  dismiss: PropTypes.func,
  setSplitterWidth: PropTypes.func,
  setDirtyFlag: PropTypes.func,
  splitterWidth: PropTypes.number,
  vertical: PropTypes.bool,
  setCursor: PropTypes.func,
  theme: PropTypes.string,
};

App.defaultProps = {
  theme: 'light',
  setCursor: noop,
  vertical: false,
  loading: true,
  match: { params: {} },
  editor: {},
  session: {},
  setDirtyFlag: noop,
};
