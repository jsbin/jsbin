import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Version from './Version';
import '../css/Footer.css';

const Footer = ({ error, username, children }) => {
  let user = username
    ? <Link to="/account">
        @{username}
      </Link>
    : <Link to="/login">Sign in</Link>;

  return (
    <footer className="Footer">
      {children}
      <p className="Version">
        {user} <Version />
      </p>
      <p
        className={classnames({ Error: true, 'has-error': !!error })}
        title={
          error ? (typeof error === 'string' ? error : error.message) : null
        }
      >
        New errors can be found in the console
      </p>
    </footer>
  );
};

export default Footer;

Footer.propTypes = {
  error: PropTypes.any,
  children: PropTypes.node,
};
