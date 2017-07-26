import React from 'react';

import { Console } from '@remy/jsconsole'; // currently a singleton
import Input from '@remy/jsconsole/dist/components/Input';
import run, { bindConsole, setContainer } from '@remy/jsconsole/dist/lib/run';

import '@remy/jsconsole/dist/jsconsole.css';

const history = [];

export default class BinConsole extends React.Component {
  constructor(props) {
    super(props);
    this.onRun = this.onRun.bind(this);
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

  componentDidMount() {
    setContainer(this.props.container);
    bindConsole(this.console);
  }

  componentWillReceiveProps(nextProps) {
    setContainer(nextProps.container);
    bindConsole(this.console);
  }

  shouldComponentUpdate() {
    return false;
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
