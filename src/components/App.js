import React, { Component } from 'react';
// use a custom splitter as I've added an onSize event
import Splitter from '@remy/react-splitter-layout';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import idk from 'idb-keyval';

import Panel from '../containers/Panel';
import Output from '../containers/Output';
import Nav from './Nav';
import Head from './Head';
import Palette from '../containers/Palette';
import * as OUTPUT from '../actions/session';
import { cmd } from '../lib/is-mac';

import '../../node_modules/@remy/react-splitter-layout/src/stylesheets/index.css';
import '../css/App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.triggerPalette = this.triggerPalette.bind(this);
    this.dismiss = this.dismiss.bind(this);
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

  async componentWillMount() {
    const { match } = this.props;

    if (match.params.localId) {
      const res = await idk.get(match.params.localId);
      this.props.setBin(res);
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

  render() {
    const { bin, loading, session, editor } = this.props;

    if (loading) {
      return (
        <div className="JsBinApp loading">
          <Head />
          <Nav />
        </div>
      );
    }

    const keyMap = {
      openPalette: [`${cmd}+shift+p`, `ctrl+shift+p`],
      dismiss: 'escape',
    };

    const handlers = {
      openPalette: this.triggerPalette,
      dismiss: this.dismiss,
    };

    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <div className="JsBinApp">
          {session.palette && <Palette />}
          <Head />
          <Nav />
          <div>
            <Splitter
              vertical={editor.vertical}
              percentage={true}
              secondaryInitialSize={100 - editor.splitterWidth}
              primaryIndex={0}
              onSize={size => {
                this.props.setSplitterWidth(size);
              }}
            >
              <Panel
                focus={!session.palette}
                onRef={ref => (this.panel = ref)}
              />
              {(session.output === OUTPUT.OUTPUT_BOTH ||
                session.output === OUTPUT.OUTPUT_PAGE) &&
                <Output code={bin.output} />}
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
  fetch: PropTypes.func,
  loadDefault: PropTypes.func,
  setSource: PropTypes.func,
  triggerPalette: PropTypes.func,
  dismiss: PropTypes.func,
  setSplitterWidth: PropTypes.func,
  setDirtyFlag: PropTypes.func,
};

App.defaultProps = {
  loading: true,
  match: { params: {} },
  editor: {},
  session: {},
  setDirtyFlag: () => {},
};
