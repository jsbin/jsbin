import React, { Component } from 'react';
import { ChromePicker } from 'react-color';
// import PropTypes from 'prop-types';

class Swatch extends Component {
  constructor(props) {
    super(props);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.dismiss = this.dismiss.bind(this);
  }

  handleChangeComplete(color) {
    this.props.setColor(color.rgb);
  }

  dismiss() {
    this.props.toggleSwatch(false);
  }

  render() {
    const { color, swatchOpen } = this.props;

    if (!swatchOpen) {
      return null;
    }

    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
      zIndex: 100,
    };

    let { x, y } = this.props;
    if (x < 0) x = 0;
    if (y < 0) y = 0;

    return (
      <div className="foo" style={cover} onClick={this.dismiss}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            left: x,
            top: y,
            position: 'absolute',
          }}
        >
          <ChromePicker color={color} onChange={this.props.onChange} />
        </div>
      </div>
    );
  }
}

Swatch.propTypes = {};

export default Swatch;
