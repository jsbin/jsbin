import React from 'react';
import PropTypes from 'prop-types';

import {
  Console, // singleton
  Input,
  run,
  bindConsole,
  setContainer,
} from '@remy/jsconsole';
import '@remy/jsconsole/dist/jsconsole.css';

const history = [];

export default class BinConsole extends React.Component {
  onRun = async command => {
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
  };

  rebind = container => {
    setContainer(container);
    bindConsole(this.console);
  };

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
  }

  shouldComponentUpdate() {
    return false; // all rendering is handled internally
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

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
