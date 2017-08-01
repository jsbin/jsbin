import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// import Nav from './Nav'; // FIXME will need user data

import '../css/PageLayout.css';

export default class PageLayout extends Component {
  render() {
    const { children, className } = this.props;

    return (
      <div className={classnames(['PageLayout', className])}>
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
};

PageLayout.defaultProps = {
  className: null,
};
