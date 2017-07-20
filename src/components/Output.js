import React from 'react';
import PropTypes from 'prop-types';

import '../css/Output.css';

export default class Output extends React.Component {
  constructor(props) {
    super(props);
    this.updateOutput = this.updateOutput.bind(this);
  }

  updateOutput() {
    const { code } = this.props;

    this.iframe.contentDocument.open();
    this.iframe.contentDocument.write(code);
    this.iframe.contentDocument.close();
  }

  componentDidMount() {
    // create an iframe
    this.updateOutput();
  }

  componentWillUnmount() {
    // remove iframe
    // unsure this is entirely required.
    this.iframe.parentNode.removeChild(this.iframe);
  }

  componentDidUpdate() {
    this.updateOutput();
  }

  shouldComponentUpdate() {
    // diff the code
  }

  render() {
    return (
      <iframe
        className="Output"
        title="JS Bin Output"
        ref={e => (this.iframe = e)}
      />
    );
  }
}

Output.propTypes = {
  code: PropTypes.string.isRequired
};

/**
 *   var iframe = null;
  $(this).after(button);
  var running = false;
  button.on('click', function () {
    // dear past Remy: why do you mix jQuery with vanilla DOM scripting?
    // Well…because vanilla is habbit, jQuery is just here as a helper.
    var code = pre.innerText;
    if (iframe || running) {
      iframe.parentNode.removeChild(iframe);
    }
    if (running) {
      button.text('run');
      iframe = null;
      running = false;
      return;
    }
    running = true;
    button.text('stop');
    iframe = document.createElement('iframe');
    iframe.className = 'runnable-frame';
    document.body.appendChild(iframe);
    iframe.contentWindow.eval(code);
  });
 */
