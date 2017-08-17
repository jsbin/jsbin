import React from 'react';
import PropTypes from 'prop-types';
import Splitter from '@remy/react-splitter-layout';
import * as RESULT from '../actions/session';
import '../css/Result.css';
import makeIframe from '../lib/makeIFrame';
import { emptyPage, html as defaultHTML } from '../lib/Defaults';

let Console = null;

export default class Result extends React.Component {
  constructor(props) {
    super(props);
    this.updateResult = this.updateResult.bind(this);
    this.state = { guid: 0, Console };

    this.iframe = makeIframe();
  }

  async updateResult(props) {
    const { error, renderResult } = props;
    let { result: renderedDoc, insertJS, javascript } = props;

    if (error) {
      // don't bother sending the state change if there's nothing to be done
      props.clearError();
    }

    const isPage = renderResult === RESULT.RESULT_PAGE;
    const isBoth = renderResult === RESULT.RESULT_BOTH;
    const isConsole = renderResult === RESULT.RESULT_CONSOLE;

    let iframe = this.iframe;

    if (isBoth || isPage) {
      if (!this.result) {
        // then we're not ready for a render, so let's exit early
        return;
      }
    }

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

    if (renderedDoc.replace(/\s/g, '') === defaultHTML.replace(/\s/g, '')) {
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

  async lazyLoad({ renderResult }) {
    // only lazy load the console once during runtime.
    if (this.state.Console !== null) return;

    if (
      renderResult === RESULT.RESULT_BOTH ||
      renderResult === RESULT.RESULT_CONSOLE
    ) {
      const {
        default: console,
      } = await import(/* webpackChunkName: "console" */ '../containers/Console');
      Console = console;
      this.setState({ Console });
      this.forceUpdate();
    }
  }

  async componentDidMount() {
    await this.lazyLoad(this.props);
    await this.updateResult(this.props);
  }

  componentWillUnmount() {
    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.lazyLoad(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    // if visible output panel has changed
    const renderResult = nextProps.renderResult !== this.props.renderResult;
    const splitColumns = nextProps.splitColumns !== this.props.splitColumns;
    if (renderResult || splitColumns) {
      return true;
    }

    // ignored: error, result
    const result = nextProps.result !== this.props.result;
    const javascript = nextProps.javascript !== this.props.javascript;

    if (result || renderResult || javascript) {
      this.updateResult(nextProps);
    }

    return false;
  }

  componentDidUpdate() {
    this.updateResult(this.props);
  }

  render() {
    const { renderResult, splitColumns } = this.props;
    const { Console } = this.state;
    const hasConsole =
      renderResult === RESULT.RESULT_CONSOLE ||
      renderResult === RESULT.RESULT_BOTH;
    const hasPage =
      renderResult === RESULT.RESULT_PAGE ||
      renderResult === RESULT.RESULT_BOTH;

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
  setError: PropTypes.func,
  clearError: PropTypes.func,
  renderResult: PropTypes.string,
  splitColumns: PropTypes.bool,
};

Result.defaultProps = {
  renderResult: RESULT.RESULT_PAGE,
  result: '',
  splitColumns: false,
};
