import React, { Component } from 'react';
// use a custom splitter as I've added an onSize event
import Splitter from '@remy/react-splitter-layout';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import * as commands from '../lib/commands';
import Cookies from 'js-cookie';
import { NotificationStack } from 'react-notification';

import * as RESULT from '../actions/session';
import Advert from '../containers/Advert';
import Panel from '../containers/Panel';
import Runner from '../containers/Runner';
import Head from '../containers/Head';
import Palette from '../containers/Palette';
import Loading from './Loading';
import Loadable from 'react-loadable';
import Error from './GenericErrorPage';
import { SET_HTML } from '../actions/bin';
import classnames from 'classnames';

import '../css/App.css';
import '@remy/react-splitter-layout/src/stylesheets/index.css';

const Welcome = Loadable({
  loader: () => import('../containers/Welcome'),
  loading: Loading,
});

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
    const { match, user } = this.props;
    this.props.fetch(match.params, user);

    this.keyMap = {
      // intentionally supporting both
      openPalette: [`command+shift+p`, `ctrl+shift+p`],
      dismiss: 'escape',
    };

    this.keyHandlers = {
      openPalette: this.triggerPalette,
      dismiss: this.dismiss,
    };

    const used = Object.keys(this.keyMap).map(key => this.keyMap[key]);

    const toMap = Object.keys(commands).filter(key => !!commands[key].shortcut);
    toMap.forEach(key => {
      const command = commands[key];
      if (used.includes(command.shortcut)) {
        console.warn(
          `command shortcut conflict on ${key} "${command.display}" ${command.shortcut}`
        );
        return;
      }
      used.push(command.shortcut);
      this.keyMap[key] = command.shortcut;
      this.keyHandlers[key] = () => {
        if (command.condition) {
          if (!command.condition(this.props)) return;
        }
        this.props.dispatchTo(command.run, this.props);
      };
    });
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
    this.props.dismissAllNotifications();
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
      return this.props.fetch(this.props.match.params, this.props.user);
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
      // FIXME lazy load welcome
      return (
        <Welcome match={this.props.match} location={this.props.location} />
      );
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

    const className = classnames(['JsBinApp', `theme-${theme}`], {
      embedded: session.embedded,
    });

    return (
      <HotKeys keyMap={this.keyMap} handlers={this.keyHandlers}>
        <div className={className}>
          {session.palette && <Palette insert={this.insertCode} />}
          <Head />
          <div className="JsBinContainer">
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
              {session.result !== RESULT.RESULT_NONE &&
                <Runner renderResult={session.result} />}
            </Splitter>
          </div>
          <Advert />
        </div>
        <NotificationStack
          notifications={this.props.notifications}
          onDismiss={e => {
            this.props.dismissNotification(e.key);
          }}
        />
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
