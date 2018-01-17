import React from 'react';
import * as RESULT from '../actions/session';
import { Parent } from '../lib/runner-channel';
import '../css/Result.css';

export default class Runner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { guid: 0 };
  }

  updateRunner(props = this.props) {
    const { error, renderResult, html } = props;
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

    // use post message to update
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

    const updated = nextProps.updated !== this.props.updated;

    if (result || renderResult || javascript || updated) {
      this.updateRunner(nextProps);
    }

    return false;
  }

  componentDidMount() {
    this.child = new Parent(this.runner);
    this.updateRunner();
  }

  componentWillUnmount() {
    console.log('unmounted');
    this.child.remove();
  }

  render() {
    const { renderResult } = this.props;

    return <div className="Runner" ref={e => (this.runner = e)} />;
  }
}
