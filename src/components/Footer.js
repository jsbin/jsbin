import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import '../css/Footer.css';

const Footer = ({ error, children }) =>
  <footer className="Footer">
    {children}
    <p
      className={classnames({ Error: true, 'has-error': !!error })}
      title={error}
    >
      New errors can be found in the console
    </p>
  </footer>;

export default Footer;

Footer.propTypes = {
  error: PropTypes.string,
  children: PropTypes.node,
};
