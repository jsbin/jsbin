import React from 'react';
import PropTypes from 'prop-types';
import Splitter from '@remy/react-splitter-layout';
import * as OUTPUT from '../actions/session';
import binToHTML from '../lib/BinToHTML';
import Console from '../containers/Console';
import '../css/Output.css';

const STATIC = process.env.REACT_APP_STATIC;

export default class Output extends React.Component {
  constructor(props) {
    super(props);
    this.updateOutput = this.updateOutput.bind(this);
    this.catchErrors = this.catchErrors.bind(this);

    this.state = { guid: 0 };

    const iframe = document.createElement('iframe');
    iframe.src = STATIC + '/blank.html';
    iframe.hidden = true;
    iframe.name = 'JS Bin Output';
    iframe.className = 'Output';
    iframe.setAttribute(
      'sandbox',
      'allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts'
    );
    this.iframe = iframe;
  }

  catchErrors(event) {
    if (event.key === 'jsbin.error') {
      // check if it came from _our_ iframe
      const data = JSON.parse(event.newValue);
      if (data.guid === this.iframe.guid) {
        this.props.setError(data.message);
        if (this.console) {
          const value = new Error(data.message);
          value.name = data.name;
          value.stack = data.stack;
          this.console.console.push({
            error: true,
            type: 'response',
            value,
          });
        }
      }
    }
  }

  updateOutput(output) {
    if (this.props.error) {
      // don't bother sending the state change if there's nothing to be done
      this.props.clearError();
    }

    const isPage = output === OUTPUT.OUTPUT_PAGE;
    const isBoth = output === OUTPUT.OUTPUT_BOTH;
    const isConsole = output === OUTPUT.OUTPUT_CONSOLE;

    const { bin } = this.props;
    const iframe = this.iframe;

    if (isBoth || isPage) {
      if (!this.output) {
        // then we're not ready for a render, so let's exit early
        return;
      }
    }

    // removing the iframe from the DOM completely resets the state and nukes
    // all running code
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }

    // if the output element is visible (i.e. the user has OUTPUT_PAGE or OUTPUT_BOTH)
    // then we need to clear the container and insert into this.output node. Otherwise,
    // we need to put in the DOM somewhere, so we drop it into the body, but leave
    // it hidden.
    if (isBoth || isPage) {
      this.output.appendChild(iframe);
      iframe.hidden = false;
    } else {
      document.body.appendChild(iframe);
      iframe.hidden = true;
    }

    const doc = iframe.contentDocument;

    let i = 0; // track script tags and add inline source map

    const html = bin.html.replace(
      /<\/script>/g,
      m => `//# sourceURL=your-scripts-${++i}.js${m}`
    );

    const guid = Math.random().toString();
    iframe.guid = guid;

    this.setState({ guid });

    // this logic will allow us to track whether there's an error, the
    // error is then passed through a localStorage event which is
    // paired back up using the guid
    const javascript = `
      try {
        ${bin.javascript}
      } catch (error) {
        try { localStorage.setItem('jsbin.error', JSON.stringify({
          name: error.name, message: error.message, stack: error.stack, guid: "${guid}"
        })); } catch (E) {}
        throw error;
      } //# sourceURL=your-scripts-${++i}.js$`;

    const renderedDoc = binToHTML({
      html,
      javascript,
      css: bin.css,
    });

    doc.open();
    doc.write('');

    // if we've already got a console reference AND we're showing the
    // console, then we rebind the console connections right before
    // we write any content (to catch the console messaging).
    if (this.console && (isBoth || isConsole)) {
      this.console.rebind(iframe);
    }

    // start writing the page. This will clear any existing document.
    // oddly this is around 40ms on a high end Mac, but .innerHTML is
    // way faster, but doesn't actually get rendered…nor does it execute
    // the JavaScript, so we'll stick with the baddie that is .write.
    doc.write(renderedDoc);
    doc.close();
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

  componentWillReceiveProps(nextProps) {
    // multiple `if` statements so that I'm super sure what's happening
    if (this.props.code !== nextProps.code) {
      this.updateOutput(nextProps.output);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.output !== this.props.output) {
      return true;
    }

    // do not re-render if the code has changed, this happens inside of the
    // iframe, and via the previous life cycle event: componentWillReceiveProps
    if (this.code !== nextProps.code) {
      return false;
    }

    return true;
  }

  componentWillUpdate(nextProps) {
    // check if the console needs to be rewired up
    if (nextProps.output !== this.props.output) {
      if (
        nextProps.output === OUTPUT.OUTPUT_BOTH ||
        nextProps.output === OUTPUT.OUTPUT_CONSOLE
      ) {
        // blows up on "BOTH"
        this.updateOutput(nextProps.output);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.output !== this.props.output) {
      // FIXME this doubles up when we show OUTPUT_BOTH
      this.updateOutput(this.props.output);
    }
  }

  render() {
    const { output, vertical } = this.props;
    const hasConsole =
      output === OUTPUT.OUTPUT_CONSOLE || output === OUTPUT.OUTPUT_BOTH;
    const hasPage =
      output === OUTPUT.OUTPUT_PAGE || output === OUTPUT.OUTPUT_BOTH;

    return (
      <div className="Output">
        <Splitter
          vertical={!vertical}
          percentage={true}
          secondaryInitialSize={50}
          primaryIndex={0}
          onSize={() => {}}
        >
          {hasPage && <div id="output" ref={e => (this.output = e)} />}
          {hasConsole &&
            <Console
              onRef={e => (this.console = e)}
              guid={this.state.guid}
              container={this.iframe}
            />}
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
  vertical: PropTypes.bool,
};

Output.defaultProps = {
  output: OUTPUT.OUTPUT_PAGE,
  vertical: false,
};
