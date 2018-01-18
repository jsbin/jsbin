import React from 'react';
import PropTypes from 'prop-types';
import Splitter from '@remy/react-splitter-layout';
import Loadable from 'react-loadable';
import sourceMap from 'source-map';

import * as RESULT from '../actions/session';
import makeIframe from '../lib/makeIFrame';
import { emptyPage, html as defaultHTML } from '../lib/Defaults';

import '../css/Result.css';
import '../css/Themes.css';

//https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState#Values
const complete = 'complete';

const Console = Loadable({
  loader: () =>
    import(/* webpackChunkName: "console" */ '../containers/Console'),
  loading: () => null,
});

let scriptURL = null;

export default class Result extends React.Component {
  constructor(props) {
    super(props);
    this.updateResult = this.updateResult.bind(this);
    this.state = { guid: 0 };

    this.iframe = makeIframe();
  }

  updateResult(props) {
    const { error, renderResult, html = '' } = props;
    let { result: renderedDoc, insertJS, javascript } = props;

    if (error) {
      // don't bother sending the state change if there's nothing to be done
      props.clearError();
    }

    if (!renderedDoc) {
      // nothing to render so exit early
      return;
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
      if (frameError.detail) {
        // handles custom emitted errors, like protect
        frameError = frameError.detail;
      }
      let { error, message, lineno: line, colno: ch } = frameError;
      if (error === null) {
        // this is when the error is like "Script error."
        error = { name: message };
      }

      if (javascript.map) {
        const consumer = new sourceMap.SourceMapConsumer(javascript.map);
        const original = consumer.originalPositionFor({ line, column: ch });
        line = original.line;
        ch = original.column;
      }

      this.props.setError({
        name: error.name,
        message,
        line,
        ch,
        // error,
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

    if (html.replace(/\s/g, '') === defaultHTML.replace(/\s/g, '')) {
      renderedDoc = emptyPage;
    }

    // start writing the page. This will clear any existing document.
    // oddly this is around 40ms on a high end Mac, but .innerHTML is
    // way faster, but doesn't actually get rendered…nor does it execute
    // the JavaScript, so we'll stick with the baddie that is .write.
    doc.write(renderedDoc);
    doc.close();

    if (!insertJS && javascript) {
      const build = () => {
        if (scriptURL) {
          // release the old URL
          URL.revokeObjectURL(scriptURL);
        }
        const blob = new Blob([javascript.code], {
          type: 'application/javascript',
        });
        const url = URL.createObjectURL(blob);
        scriptURL = url;
        const script = doc.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = url;
        script.noModule = true;
        doc.documentElement.appendChild(script);

        const scriptModule = doc.createElement('script');
        scriptModule.async = true;
        scriptModule.defer = true;
        scriptModule.src = url;
        scriptModule.type = 'module';
        doc.documentElement.appendChild(scriptModule);
      };

      // this is a wonderful quirk of readiness. what happens is if the HTML
      // contains a script tag, it'll block rendering, but since it's inside
      // an iframe, it's an async action whilst *this* code in the "main"
      // thread continues execution. so if there's a script that doesn't
      // complete by the time the `build` function inserts the script tag
      // the iframe won't have created all the DOM nodes yet, and the script
      // tag of the injected code ends up _before_ the actual DOM `body`
      // element, causing errors. so we rely on the document ready state
      // to be sure we're ready to inject.
      if (doc.readyState === complete) {
        build();
      } else {
        doc.onreadystatechange = () => {
          if (doc.readyState === complete) {
            build();
          }
        };
      }
    }
  }

  componentDidMount() {
    this.updateResult(this.props);
  }

  componentWillUnmount() {
    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
  }

  shouldComponentUpdate(nextProps) {
    // if visible output panel has changed
    const renderResult = nextProps.renderResult !== this.props.renderResult;
    const splitColumns = nextProps.splitColumns !== this.props.splitColumns;

    const theme = nextProps.theme !== this.props.theme;

    if (theme) {
      return true;
    }

    if (splitColumns) {
      return false;
    }

    if (renderResult) {
      return true;
    }

    // ignored: error, result
    const result = nextProps.result !== this.props.result;
    const javascript = nextProps.javascript !== this.props.javascript;

    const updated = nextProps.updated !== this.props.updated;

    if (result || renderResult || javascript || updated) {
      this.updateResult(nextProps);
    }

    return false;
  }

  componentDidUpdate() {
    // this.updateResult(this.props);
  }

  render() {
    const { renderResult, splitColumns, theme } = this.props;

    const hasConsole =
      renderResult === RESULT.RESULT_CONSOLE ||
      renderResult === RESULT.RESULT_BOTH;
    const hasPage =
      renderResult === RESULT.RESULT_PAGE ||
      renderResult === RESULT.RESULT_BOTH;

    return (
      <div className={`Result theme-${theme}`}>
        <Splitter
          vertical={splitColumns}
          percentage={true}
          secondaryInitialSize={50}
          primaryIndex={0}
          onSize={() => {}}
        >
          {hasPage && <div id="result" ref={e => (this.result = e)} />}
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
