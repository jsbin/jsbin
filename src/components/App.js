import React, { Component } from 'react';
// use a custom splitter as I've added an onSize event
import Splitter from '@remy/react-splitter-layout';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';

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
    this.hideOutput = this.hideOutput.bind(this);
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

  hideOutput(e) {
    const { output } = this.props.editor;
    if (e.target.className === 'layout-splitter') {
      this.props.toggleOutput(false);
    }

    if (output === false) {
      this.props.toggleOutput(true);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.editor.output !== prevProps.editor.output) {
      this.panel.refresh();
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
    const { match } = this.props;
    if (!match.params.bin) {
      // new bin
      // dispatch request for default bin
      this.props.loadDefault();
      return;
    }

    this.props.fetch(match.params);
  }

  render() {
    const { bin, editor, loading, session } = this.props;

    if (loading) {
      return (
        <div className="JsBinApp loading">
          <Head />
          <Nav />
        </div>
      );
    }

    const keyMap = {
      openPalette: `ctrl+shift+p`,
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
          <div onDoubleClick={this.hideOutput}>
            <Splitter
              split="vertical"
              defaultSize="50%"
              onSize={() => {
                this.panel.refresh();
              }}
            >
              <Panel
                focus={!session.palette}
                onRef={ref => (this.panel = ref)}
                mode={editor.source}
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
  fetch: PropTypes.func,
  editor: PropTypes.object,
  session: PropTypes.object,
  loadDefault: PropTypes.func,
  setSource: PropTypes.func,
  toggleOutput: PropTypes.func,
  triggerPalette: PropTypes.func,
  dismiss: PropTypes.func,
};
