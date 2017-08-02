import React from 'react';
import PropTypes from 'prop-types';

import { Console } from '@remy/jsconsole'; // currently a singleton
import Input from '@remy/jsconsole/dist/components/Input';
import run, { bindConsole, setContainer } from '@remy/jsconsole/dist/lib/run';

import '@remy/jsconsole/dist/jsconsole.css';

const history = [];

export default class BinConsole extends React.Component {
  constructor(props) {
    super(props);
    this.onRun = this.onRun.bind(this);
    this.rebind = this.rebind.bind(this);
  }

  async onRun(command) {
    const console = this.console;

    console.push({
      type: 'command',
      command,
      value: command,
    });
    const res = await run(command);
    console.push({
      command,
      type: 'response',
      ...res,
    });
  }

  rebind(container) {
    setContainer(container);
    bindConsole(this.console);
  }

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
  }

  shouldComponentUpdate() {
    return false; // all rendering is handled internally
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  // TODO on prop change, set container to prop

  render() {
    const commands = [];
    return (
      <div className="Console">
        <Console
          ref={e => (this.console = e)}
          commands={commands}
          reverse={false}
        />
        <Input
          inputRef={e => (this.input = e)}
          autoFocus={false}
          onRun={this.onRun}
          history={history}
          addHistory={cmd => {
            history.push(cmd);
          }}
          onClear={() => {
            this.console.clear();
          }}
        />
      </div>
    );
  }
}

BinConsole.propTypes = {
  onRef: PropTypes.func.isRequired,
  container: PropTypes.any.isRequired, // real DOM node
};
