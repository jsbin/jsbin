import React, { Component } from 'react';
import Splitter from 'react-split-pane';
import Panel from './components/Panel';
import Output from './components/Output';
import Nav from './components/Nav';
import PropTypes from 'prop-types';

import './css/App.css';

export default class App extends Component {
  render() {
    const { code } = this.props;
    return (
      <div className="JsBinApp">
        <Nav />
        <Splitter split="vertical" defaultSize="50%">
          <Panel mode="html" code={code} />
          <Output code={code} />
        </Splitter>
      </div>
    );
  }
}

App.propTypes = {
  code: PropTypes.string
};
