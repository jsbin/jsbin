import React from 'react';
import PropTypes from 'prop-types';
import Splitter from '@remy/react-splitter-layout';
import Loadable from 'react-loadable';
import sourceMap from 'source-map';

import * as RESULT from '../actions/session';
import makeIframe from '../lib/makeIFrame';
import {
  emptyPage,
  html as defaultHTML,
  javascript as defaultJS,
} from '../lib/Defaults';

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
    this.state = { guid: 0 };

    this.iframe = makeIframe();
  }

  rebindConsole = () => {
    // we have:
    // 1. console inserted
    // 2. iframe is attached to the document
    if (this.console && this.iframe.contentWindow) {
      this.console.rebind(this.iframe);
    } else {
      // console.warn('Result::rebind (skip)');
    }
  };

  updateResult = props => {
    const { error, renderResult, html = '' } = props;
    let { result: renderedDoc, insertJS, javascript } = props;

    if (error) {
      // don't bother sending the state change if there's nothing to be done
      props.clearError();
    }

    if (!renderedDoc) {
      // nothing to render so exit early
      // console.warn('(exit)updateResult, no renderDoc', this.props);
      return;
    }

    const isPage = renderResult === RESULT.RESULT_PAGE;
    const isBoth = renderResult === RESULT.RESULT_BOTH;

    let iframe = this.iframe;

    if (isBoth || isPage) {
      // this.result = the div the iframe lives inside of
      if (!this.result) {
        // console.warn('(exit)updateResult, no this.result');
        // then we're not ready for a render, so let's exit early
        return;
      }
    }

    // removing the iframe from the DOM completely resets the state and nukes
    // all running code
    if (iframe.parentNode) {
      // console.warn(
      //   'removing iframe from updateResult - but expect to reinsert'
      // );
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

      if (javascript.map && !frameError.custom && line > 0) {
        const consumer = new sourceMap.SourceMapConsumer(javascript.map);
        const original = consumer.originalPositionFor({ line, column: ch });
        line = original.line;
        ch = original.column;
      }

      if (line === 0) {
        // this is a weird error that comes from the program, and not the source
        // code. an example of this is if you do `import x from ''`, it gives
        // line 0, ch 0 as the source. so for tidiness, I'll remove it.
        line = null;
        ch = null;
      }

      this.props.setError({
        name: error.name,
        message,
        line,
        ch,
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

    if (
      html.replace(/\s/g, '') === defaultHTML.replace(/\s/g, '') &&
      javascript.code !== defaultJS
    ) {
      console.log('has empty', html.replace(/\s/g, ''));
      renderedDoc = emptyPage;
    }

    // strip autofocus from the markup, preventing the focus switching out of
    // the editable area.
    renderedDoc = renderedDoc.replace(/(<.*?\s)(autofocus)/g, '$1');

    // if we've already got a console reference AND we're showing the
    // console, then we rebind the console connections right before
    // we write any content (to catch the console messaging).
    this.rebindConsole();

    // start writing the page. This will clear any existing document.
    // oddly this is around 40ms on a high end Mac, but .innerHTML is
    // way faster, but doesn't actually get rendered…nor does it execute
    // the JavaScript, so we'll stick with the baddie that is .write.
    doc.write(renderedDoc);
    doc.close();

    // note: insertJS is true only when %code% is present in the original
    // markup - i.e. rarely since this harks back to 2008.
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
        script.noModule = javascript.module;
        doc.body.appendChild(script);

        if (javascript.module) {
          const scriptModule = doc.createElement('script');
          scriptModule.async = true;
          scriptModule.defer = true;
          scriptModule.src = url;
          scriptModule.type = 'module';
          doc.documentElement.appendChild(scriptModule);
        }
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
  };

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

    // only update the UI if something changed in the view
    // more specifically: don't re-render if the content of the iframe will change
    if (renderResult || theme || splitColumns) {
      return true;
    }

    const result = nextProps.result !== this.props.result;
    const javascript = nextProps.javascript !== this.props.javascript;
    const updated = nextProps.updated !== this.props.updated;
    // TODO CSS

    if (result || javascript || updated) {
      this.updateResult(nextProps);
    }

    return false;
  }

  componentDidUpdate(prevProps) {
    /**
     * this logic is required as the page is being shown for the first time,
     * but the iframe has been removed. So we check if the component updated
     * and if the props.renderResult satisfies any of the following rules,
     * then it will update the result (effectively creating the rendered iframe)
     *   showingPage =
     *   - console -> page
     *   - console -> both
     *   - console -> none // noop
     */
    const renderResult = prevProps.renderResult !== this.props.renderResult;
    const showingPage =
      prevProps.renderResult === RESULT.RESULT_CONSOLE && renderResult;

    if (showingPage) {
      this.updateResult(this.props);
    }

    // if the console was just shown for the first time, we need to rebind
    // it to the iframe
    const rebind =
      renderResult && this.props.renderResult !== RESULT.RESULT_PAGE;

    if (rebind) {
      this.rebindConsole();
    }
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
              onRef={e => {
                this.console = e;
                this.updateResult(this.props);
              }}
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
