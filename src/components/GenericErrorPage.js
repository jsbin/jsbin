import React from 'react';
import PropTypes from 'prop-types';
import Head from './Head';

const ErrorPage = ({ children, message, status }) => {
  return (
    <div>
      <Head>
        <title>Uh oh</title>
      </Head>
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
      {children}
    </div>
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
