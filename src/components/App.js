import React, { Component } from 'react';
import Splitter from '@remy/react-splitter-layout';
import PropTypes from 'prop-types';

import Panel from '../containers/Panel';
import Output from '../containers/Output';
import Nav from './Nav';
import Head from './Head';

import '../../node_modules/@remy/react-splitter-layout/src/stylesheets/index.css';
import '../css/App.css';

const keyMap = {
  html: ['ctrl+1', 'command+1'],
  css: ['ctrl+2', 'command+2'],
  javascript: ['ctrl+3', 'command+3']
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.hideOutput = this.hideOutput.bind(this);
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
    const { bin, editor, loading } = this.props;

    if (loading) {
      return (
        <div className="JsBinApp loading">
          <Head />
          <Nav />
        </div>
      );
    }

    return (
      <div className="JsBinApp">
        <Head />
        <Nav />
        <div onDoubleClick={this.hideOutput}>
          <Splitter
            split="vertical"
            defaultSize="50%"
            onSize={(() => {
              this.panel.refresh();
            }).bind(this)}
          >
            <Panel onRef={ref => (this.panel = ref)} mode={editor.source} />
            {editor.output && <Output code={bin.output} />}
          </Splitter>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  bin: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  match: PropTypes.object,
  fetch: PropTypes.func,
  editor: PropTypes.object,
  loadDefault: PropTypes.func,
  setSource: PropTypes.func,
  toggleOutput: PropTypes.func
};
