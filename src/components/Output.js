import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import binToHTML from '../lib/BinToHTML';

import '../css/Output.css';

export default class Output extends React.Component {
  constructor(props) {
    super(props);
    this.updateOutput = debounce(this.updateOutput.bind(this), 200);
    this.catchErrors = this.catchErrors.bind(this);
  }

  catchErrors(event) {
    if (event.key === 'jsbin.error') {
      // check if it came from _our_ iframe
      const data = JSON.parse(event.newValue);
      if (data.guid === this.iframe.guid) {
        this.props.setError(data.error);
      }
    }
  }

  updateOutput() {
    if (!this.output) {
      // this happens if updateOutput was debounced, but the component was removed.
      return;
    }
    this.props.clearError();
    const { bin } = this.props;
    const iframe = document.createElement('iframe');
    iframe.src = '/blank.html';
    iframe.hidden = true;
    iframe.name = 'JS Bin Output';
    iframe.className = 'Output';
    iframe.setAttribute(
      'sandbox',
      'allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts'
    );
    this.output.innerHTML = '';
    this.output.appendChild(iframe);
    this.iframe = iframe;

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

    const guid = Math.random().toString();
    this.iframe.guid = guid;

    const javascript = `
      try {
        ${bin.javascript}
      } catch (error) {
        try { localStorage.setItem('jsbin.error', JSON.stringify({
          error: error.message, guid: "${guid}"
        })); } catch (E) {}
        throw error;
      } //# sourceURL=your-scripts-${++i}.js$`;

    const output = binToHTML({
      html,
      javascript,
      css: bin.css,
    });

    doc.write(output);
    doc.close();

    iframe.hidden = false;
  }

  componentDidMount() {
    this.updateOutput();
    window.addEventListener('storage', this.catchErrors, false);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.catchErrors, false);
  }

  // FIXME: not sure this is actually need
  componentDidUpdate(prevProps) {
    if (prevProps.code !== this.props.code) {
      this.updateOutput();
    }
  }

  render() {
    return (
      <div className="Output">
        <div id="output" ref={e => (this.output = e)} />
      </div>
    );
  }
}

Output.propTypes = {
  code: PropTypes.string.isRequired, // FIXME not entirely sure
  bin: PropTypes.object.isRequired,
  setError: PropTypes.func,
  clearError: PropTypes.func,
};
