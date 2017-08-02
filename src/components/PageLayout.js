import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { LIGHT } from '../actions/app';
// import Nav from './Nav'; // FIXME will need user data

import '../css/App.css';
import '../css/PageLayout.css';

export default class PageLayout extends Component {
  render() {
    const { children, className, theme } = this.props;

    return (
      <div className={classnames(['PageLayout', className, `theme-${theme}`])}>
        <main>
          {children}
        </main>
      </div>
    );
  }
}

PageLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  theme: PropTypes.string,
};

PageLayout.defaultProps = {
  className: null,
  theme: LIGHT,
};
