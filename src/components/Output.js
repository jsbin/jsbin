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
    const iframe = this.iframe; //document.createElement('iframe');
    // iframe.hidden = true;
    // iframe.name = 'JS Bin Output';
    // iframe.className = 'Output';
    // this.output.appendChild(iframe);

    const doc = iframe.contentDocument;

    // start writing the page. This will clear any existing document.
    iframe.contentDocument.open();

    // this is to avoid a Firefox issue (see original jsbin)
    doc.write('');

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
      css: bin.css,
    });

    doc.write(output);
    doc.close();
  }

  componentDidMount() {
    this.updateOutput();
  }

  // FIXME: not sure this is actually need
  componentDidUpdate(prevProps) {
    if (prevProps.code !== this.props.code) {
      this.updateOutput();
    }
  }

  render() {
    return (
      <div id="output" ref={e => (this.output = e)}>
        <iframe
          className="Output"
          title="JS Bin Output"
          ref={e => (this.iframe = e)}
        />
      </div>
    );
  }
}

Output.propTypes = {
  code: PropTypes.string.isRequired, // FIXME not entirely sure
  bin: PropTypes.object.isRequired,
};
