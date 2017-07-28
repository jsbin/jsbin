import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Head from './Head';

import '../css/App.css';
import '../css/Welcome.css';

class Welcome extends Component {
  render() {
    return (
      <div className="Welcome">
        <Head>
          <title>{`👋 JS Bin`}</title>
        </Head>

        <header>
          <h1>Welcome</h1>
        </header>
        <div className="flex-col">
          <div className="col">
            <div className="block flex">
              <h2>Get started</h2>
              <ul>
                <li>
                  <a href="#">New bin</a>
                </li>
                <li>
                  <a href="#">Open existing bin</a>
                </li>
              </ul>
            </div>
            <div className="block flex">
              <h2>Get started</h2>
              <ul>
                <li>
                  <a href="#">New bin</a>
                </li>
                <li>
                  <a href="#">Open existing bin</a>
                </li>
              </ul>
            </div>
            <div className="block shrink">
              <p>
                <label>Show welcome screen on startup</label>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="block">
              <h2>Tips</h2>
            </div>

            <div className="block">
              <h2>Become Pro</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Welcome.propTypes = {};

export default Welcome;
