import React from 'react';
// import PropTypes from 'prop-types';
import Menu from './Menu';

import '../css/Nav.css';

export default class Nav extends React.Component {
  render() {
    return (
      <nav className="Nav">
        <Menu title="File" align="left">
          <ul>
            <li>Save</li>
          </ul>
        </Menu>
        <Menu title="Help" align="right">
          <ul>
            <li>Blog</li>
          </ul>
        </Menu>
      </nav>
    );
  }
}

Nav.propTypes = {};
