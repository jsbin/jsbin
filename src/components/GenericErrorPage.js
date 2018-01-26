import React from 'react';
import PropTypes from 'prop-types';
import Head from './Head';
import Layout from '../containers/PageLayout';

const ErrorPage = ({ children, message, status }) => {
  return (
    <Layout className="ErrorPage">
      <Head title="Uh oh..." />
      <h1>
        Whoops! Something went wrong{' '}
        <span role="img" aria-labelledby="super sad face">
          😟
        </span>
      </h1>
      <p>
        {message} (<code>{status}</code>)
      </p>
      <div className="jsbin-fail" />
      {children
        ? children
        : <img src="/images/favicon.svg" className="jsbin-error" alt="" />}
      <p>
        <strong>
          <a href="/">Alternatively, click here to start a new bin</a>
        </strong>
      </p>
    </Layout>
  );
};

export default ErrorPage;

ErrorPage.propTypes = {
  status: PropTypes.number,
  message: PropTypes.string,
  children: PropTypes.node,
};

ErrorPage.defaultProps = {
  status: 500,
  message: `This is embarrassing, I'm not actually sure what it was, but, there may be hope. If you can check your browser's native console, perhaps there's some error shown there that you can use to help diagnose and report the bug.`,
};
