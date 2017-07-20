import React, { Component } from 'react';
import Splitter from 'react-split-pane';
import { Helmet } from 'react-helmet';

import Panel from '../containers/Panel';
import Output from './Output';
import Nav from './Nav';
import PropTypes from 'prop-types';

import '../css/App.css';
const STATIC = process.env.REACT_APP_STATIC;

export default class App extends Component {
  render() {
    const { bin } = this.props;
    return (
      <div className="JsBinApp">
        <Helmet>
          <meta charSet="utf-8" />
          <title>JS Bin</title>
          <link rel="icon" href={`${STATIC}/images/favicon.png`} />
          <link rel="shortcut icon" href={`${STATIC}/images/favicon.png`} />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="canonical" href="https://jsbin.com" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        </Helmet>
        <Nav />
        <Splitter split="vertical" defaultSize="50%">
          <Panel mode="html" />
          <Output code={bin.output} />
        </Splitter>
      </div>
    );
  }
}

App.propTypes = {
  bin: PropTypes.object
};
