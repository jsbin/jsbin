import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Layout from '../containers/PageLayout';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {}

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    return (
      <Layout className="Login">
        <h1>Sign into JS Bin</h1>
        <button>Sign in</button>
      </Layout>
    );
  }
}

Login.propTypes = {};

export default Login;
