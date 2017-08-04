import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import Layout from '../containers/PageLayout';

import '../css/Button.css';
import '../css/Login.css';

class Login extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {}

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    return (
      <Layout>
        <div className="Login">
          <div>
            <h1>Sign in to JS Bin</h1>
            <a
              href={`${process.env.REACT_APP_API}/auth`}
              className="Button pretty"
            >
              Using Github
            </a>

            <h2>Why?</h2>
            <ul>
              <li>Publish and share URLs</li>
              <li>Export to Gists and embed in your website</li>
              <li>Create privately shareable bins</li>
              <li>Sync your settings</li>
              <li>5GB of hosted assets</li>
            </ul>
          </div>
        </div>
      </Layout>
    );
  }
}

Login.propTypes = {};

export default Login;
