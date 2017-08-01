import React, { Component } from 'react';
// use a custom splitter as I've added an onSize event
import Splitter from '@remy/react-splitter-layout';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import Cookies from 'js-cookie';

import Welcome from '../containers/Welcome';
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

    // this actually means ignore the welcome page altogether
    let welcomeSeen = props.showWelcome === false;

    if (!welcomeSeen) {
      welcomeSeen = Cookies.get('welcomeSeen') || false;
    }

    this.state = {
      welcomeSeen,
    };
  }

  componentWillMount() {
    const { match } = this.props;
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
    // this is a little bit manky, but it detects that the url has changed
    // either via the browser history, or via a history.push (like "open bin")
    // and IF the action was NOT replace, then we load up the bin.
    // If the action was 'REPLACE' then it was a URL change managed by either
    // a "save" (where the URL goes from / to /local/1234) or if the search
    // query was added.
    if (
      this.props.match.url !== prevProps.match.url &&
      this.props.history.action !== 'REPLACE'
    ) {
      return this.props.fetch(this.props.match.params);
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
      splitColumns,
      theme,
    } = this.props;

    const { welcomeSeen } = this.state;

    if (!welcomeSeen) {
      Cookies.set('welcomeSeen', true);
      return <Welcome />;
    }

    if (loading) {
      return (
        <div className={`JsBinApp loading theme-${theme}`}>
          <Head />
          <Loading />
        </div>
      );
    }

    if (bin.error) {
      return <Error {...bin.error} />;
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
              vertical={!splitColumns}
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
  showWelcome: PropTypes.bool,
  match: PropTypes.object,
  history: PropTypes.object,
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
  splitColumns: PropTypes.bool,
  setCursor: PropTypes.func,
  theme: PropTypes.string,
};

App.defaultProps = {
  theme: 'light',
  setCursor: noop,
  splitColumns: false,
  loading: true,
  match: { params: {} },
  history: {},
  editor: {},
  session: {},
  setDirtyFlag: noop,
  showWelcome: true,
};
