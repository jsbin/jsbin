import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Command, Shift } from './Symbols';
import '../css/Footer.css';

const Footer = ({ error }) =>
  <footer className="Footer">
    <p>
      Show all commands <Command /> <Shift /> P
    </p>
    <p
      className={classnames({ error: true, 'has-error': !!error })}
      title={error}
    >
      New errors can be found in the console
    </p>
  </footer>;

export default Footer;

Footer.propTypes = {
  error: PropTypes.string,
};
