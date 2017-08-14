import React from 'react';
import PropTypes from 'prop-types';
import Splitter from '@remy/react-splitter-layout';
import * as RESULT from '../actions/session';
import '../css/Result.css';
import processor from '../lib/processor';
import makeIframe from '../lib/makeIFrame';
import { emptyPage } from '../lib/Defaults';

export default class Result extends React.Component {
  constructor(props) {
    super(props);
    this.updateResult = this.updateResult.bind(this);
    this.catchErrors = this.catchErrors.bind(this);

    this.state = { guid: 0, Console: null };

    this.iframe = makeIframe();
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

  async updateResult(result) {
    if (this.props.error) {
      // don't bother sending the state change if there's nothing to be done
      this.props.clearError();
    }

    const isPage = result === RESULT.RESULT_PAGE;
    const isBoth = result === RESULT.RESULT_BOTH;
    const isConsole = result === RESULT.RESULT_CONSOLE;

    const { bin, source } = this.props;
    let iframe = this.iframe;

    if (isBoth || isPage) {
      if (!this.result) {
        // then we're not ready for a render, so let's exit early
        return;
      }
    }

    let { result: renderedDoc, insertJS, javascript } = await processor(
      bin,
      source
    );

    // removing the iframe from the DOM completely resets the state and nukes
    // all running code
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
      this.iframe = iframe = makeIframe();
    }

    // if the result element is visible (i.e. the user has RESULT_PAGE or RESULT_BOTH)
    // then we need to clear the container and insert into this.result node. Otherwise,
    // we need to put in the DOM somewhere, so we drop it into the body, but leave
    // it hidden.
    if (isBoth || isPage) {
      this.result.appendChild(iframe);
      iframe.hidden = false;
    } else {
      document.body.appendChild(iframe);
      iframe.hidden = true;
    }

    const doc = iframe.contentDocument;

    const guid = Math.random().toString();
    iframe.guid = guid;

    this.setState({ guid });

    doc.open();
    doc.write('');

    iframe.contentWindow.addEventListener('error', (frameError, ...args) => {
      let { error, message, lineno: line, colno: ch } = frameError;
      if (error === null) {
        // this is when the error is like "Script error."
        error = { name: message };
      }

      this.props.setError({
        name: error.name,
        message,
        line,
        ch,
        error,
      });
      if (this.console) {
        const value = new Error(message);
        value.name = error.name;
        value.stack = error.stack;
        value.lineno = line;
        value.colno = ch;
        this.console.console.push({
          error: true,
          type: 'response',
          value,
        });
      }
    });

    // if we've already got a console reference AND we're showing the
    // console, then we rebind the console connections right before
    // we write any content (to catch the console messaging).
    if (this.console && (isBoth || isConsole)) {
      this.console.rebind(iframe);
    }

    if (/<body>\s+<\/body>/im.test(renderedDoc)) {
      renderedDoc = emptyPage;
    }

    // start writing the page. This will clear any existing document.
    // oddly this is around 40ms on a high end Mac, but .innerHTML is
    // way faster, but doesn't actually get rendered…nor does it execute
    // the JavaScript, so we'll stick with the baddie that is .write.
    doc.write(renderedDoc);
    doc.close();

    if (!insertJS) {
      const script = doc.createElement('script');
      const blob = new Blob([javascript], { type: 'application/javascript' });
      script.src = URL.createObjectURL(blob);
      doc.documentElement.appendChild(script);
    }
  }

  async lazyLoad({ result }) {
    if (this.state.Console) return;

    if (result === RESULT.RESULT_BOTH || result === RESULT.RESULT_CONSOLE) {
      const {
        default: Console,
      } = await import(/* webpackChunkName: "console" */ '../containers/Console');
      this.setState({ Console });
      this.forceUpdate();
    }
  }

  async componentDidMount() {
    await this.lazyLoad(this.props);
    await this.updateResult(this.props.result);
    window.addEventListener('storage', this.catchErrors, false);
  }

  componentWillUnmount() {
    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    window.removeEventListener('storage', this.catchErrors, false);
  }

  async componentWillReceiveProps(nextProps) {
    await this.lazyLoad(nextProps);

    // multiple `if` statements so that I'm super sure what's happening
    if (this.props.code !== nextProps.code) {
      return this.updateResult(nextProps.result);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.code !== this.props.code) {
      return true;
    }

    if (nextProps.result !== this.props.result) {
      return true;
    }

    // do not re-render if the code has changed, this happens inside of the
    // iframe, and via the previous life cycle event: componentWillReceiveProps
    if (this.code !== nextProps.code) {
      return false;
    }

    return true;
  }

  async componentWillUpdate(nextProps) {
    // check if the console needs to be rewired up
    if (nextProps.result !== this.props.result) {
      if (
        nextProps.result === RESULT.RESULT_BOTH ||
        nextProps.result === RESULT.RESULT_CONSOLE
      ) {
        // blows up on "BOTH"
        return this.updateResult(nextProps.result);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.result !== this.props.result ||
      prevProps.code !== this.props.code
    ) {
      // FIXME this doubles up when we show RESULT_BOTH
      return this.updateResult(this.props.result);
    }
  }

  render() {
    const { result, splitColumns } = this.props;
    const { Console } = this.state;
    const hasConsole =
      result === RESULT.RESULT_CONSOLE || result === RESULT.RESULT_BOTH;
    const hasPage =
      result === RESULT.RESULT_PAGE || result === RESULT.RESULT_BOTH;

    return (
      <div className="Result">
        <Splitter
          vertical={splitColumns}
          percentage={true}
          secondaryInitialSize={50}
          primaryIndex={0}
          onSize={() => {}}
        >
          {hasPage && <div id="result" ref={e => (this.result = e)} />}
          {hasConsole &&
            Console &&
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

Result.propTypes = {
  code: PropTypes.string.isRequired, // FIXME not entirely sure
  bin: PropTypes.object.isRequired,
  setError: PropTypes.func,
  clearError: PropTypes.func,
  result: PropTypes.string,
  splitColumns: PropTypes.bool,
};

Result.defaultProps = {
  result: RESULT.RESULT_PAGE,
  splitColumns: false,
};
