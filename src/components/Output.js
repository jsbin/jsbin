import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Splitter from '@remy/react-splitter-layout';
import { bindConsole, setContainer } from '@remy/jsconsole/dist/lib/run';

import * as OUTPUT from '../actions/session';
import binToHTML from '../lib/BinToHTML';
import Console from '../containers/Console';
import '../css/Output.css';

export default class Output extends React.Component {
  constructor(props) {
    super(props);
    this.updateOutput = this.updateOutput.bind(this);
    this.catchErrors = this.catchErrors.bind(this);
    this.state = {
      container: null,
    };
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

  updateOutput(output) {
    if (this.props.error) {
      // don't bother sending the state change if there's nothing to be done
      this.props.clearError();
    }

    const { bin } = this.props;
    const { container } = this.state;

    if (container) {
      container.parentNode.removeChild(container);
    }

    const iframe = document.createElement('iframe');
    iframe.src = '/blank.html';
    iframe.hidden = true;
    iframe.name = 'JS Bin Output';
    iframe.className = 'Output';
    iframe.setAttribute(
      'sandbox',
      'allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts'
    );

    // if the output element is visible (i.e. the user has OUTPUT_PAGE or OUTPUT_BOTH)
    // then we need to clear the container and insert into this.output node. Otherwise,
    // we need to put in the DOM somewhere, so we drop it into the body, but leave
    // it hidden.
    if (output === OUTPUT.OUTPUT_BOTH || output === OUTPUT.OUTPUT_PAGE) {
      this.output.innerHTML = '';
      this.output.appendChild(iframe);
    } else {
      try {
        // just in case it's already hanging around
        document.body.removeChild(this.iframe);
      } catch (e) {}
      document.body.appendChild(iframe);
    }

    this.iframe = iframe;

    const doc = iframe.contentDocument;

    // bind to the console at this point
    // if (output === OUTPUT.OUTPUT_BOTH || OUTPUT.OUTPUT_CONSOLE) {
    //   setContainer(iframe);
    // }

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

    const renderedDoc = binToHTML({
      html,
      javascript,
      css: bin.css,
    });

    doc.write(renderedDoc);
    doc.close();

    this.setState({ container: iframe });

    if (output === OUTPUT.OUTPUT_BOTH || output === OUTPUT.OUTPUT_PAGE) {
      iframe.hidden = false;
    }
  }

  componentWillMount() {
    // if (this.props.output === OUTPUT.OUTPUT_CONSOLE) {
    // this.updateOutput(this.props.output);
    // }
  }

  componentDidMount() {
    this.updateOutput(this.props.output);
    window.addEventListener('storage', this.catchErrors, false);
  }

  componentWillUnmount() {
    if (this.iframe) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    window.removeEventListener('storage', this.catchErrors, false);
  }

  // FIXME: not sure this is actually need
  componentWillReceiveProps(nextProps) {
    if (nextProps.output === OUTPUT.OUTPUT_CONSOLE) {
      this.updateOutput(OUTPUT.OUTPUT_CONSOLE);
    }
  }

  render() {
    const { output } = this.props;
    const hasConsole =
      output === OUTPUT.OUTPUT_CONSOLE || output === OUTPUT.OUTPUT_BOTH;
    const hasPage =
      output === OUTPUT.OUTPUT_PAGE || output === OUTPUT.OUTPUT_BOTH;

    return (
      <div className="Output">
        <Splitter
          vertical={true}
          percentage={true}
          secondaryInitialSize={50}
          primaryIndex={0}
          onSize={() => {}}
        >
          {hasPage && <div id="output" ref={e => (this.output = e)} />}
          {hasConsole && <Console container={this.state.container} />}
        </Splitter>
      </div>
    );
  }
}

Output.propTypes = {
  code: PropTypes.string.isRequired, // FIXME not entirely sure
  bin: PropTypes.object.isRequired,
  setError: PropTypes.func,
  clearError: PropTypes.func,
  output: PropTypes.string,
};

Output.defaultProps = {
  output: OUTPUT.OUTPUT_PAGE,
};
