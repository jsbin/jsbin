import React from 'react';
import { Parent } from '../lib/runner-channel';
import '../css/Result.css';

export default class Runner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { guid: 0 };
  }

  shouldComponentUpdate() {
    // don't ever update once it's rendered
    return false;
  }

  componentDidMount() {
    const {
      result,
      updated,
      insertJS,
      javascript,
      html,
      splitColumns,
      renderResult,
    } = this.props;

    this.child = new Parent(this.runner, {
      result,
      updated,
      insertJS,
      javascript,
      html,
      splitColumns,
      renderResult,
    });
  }

  componentWillUnmount() {
    this.child.remove();
  }

  render() {
    return <div className="Runner" ref={e => (this.runner = e)} />;
  }
}
