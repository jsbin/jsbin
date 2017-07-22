import React from 'react';
import PropTypes from 'prop-types';
import binToHTML from '../lib/BinToHTML';

import '../css/Output.css';

export default class Output extends React.Component {
  constructor(props) {
    super(props);
    this.updateOutput = this.updateOutput.bind(this);
  }

  updateOutput() {
    const { bin } = this.props;
    const document = this.iframe.contentDocument;

    // start writing the page. This will clear any existing document.
    this.iframe.contentDocument.open();

    // this is to avoid a Firefox issue (see original jsbin)
    document.write('');

    let i = 0;

    const html = bin.html.replace(
      /<\/script>/g,
      m => `//# sourceURL=your-scripts-${++i}.js${m}`
    );
    const javascript =
      bin.javascript + `\n//# sourceURL=your-scripts-${++i}.js$`;

    const output = binToHTML({
      html,
      javascript,
      css: bin.css
    });

    document.write(output);
    document.close();
  }

  componentDidMount() {
    // create an iframe
    this.updateOutput();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.code !== this.props.code) {
      this.updateOutput();
    }
  }

  // shouldComponentUpdate() {
  //   // diff the code
  //   return true;
  // }

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
