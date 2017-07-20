import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import '../css/Menu.css';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const { open } = this.state;
    const { title, align = 'left', children } = this.props;

    if (!open) {
      return (
        <div className={classnames(['Menu', 'closed', align])}>
          {title}
        </div>
      );
    }

    return (
      <div className={classnames(['Menu', 'open', align])}>
        {title}
        {children}
      </div>
    );
  }
}

Menu.propTypes = {
  align: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};
