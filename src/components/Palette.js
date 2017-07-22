import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import * as allCommands from '../lib/commands';
import '../css/Palette.css';

const UP = 38;
const DOWN = 40;
const ENTER = 13;

export default class Palette extends React.Component {
  constructor(props) {
    super(props);

    this.onFilter = this.onFilter.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      commands: [...Object.keys(allCommands)],
      filter: '>',
      active: 0,
    };
  }

  onRun(command) {
    this.props.run(command);
    this.props.dismiss();
  }

  onKeyDown(e) {
    const key = e.which;

    if (key === UP || key === DOWN || key === ENTER) {
      let { active, commands } = this.state;
      e.preventDefault();
      if (key === ENTER) {
        return this.onRun(commands[active]);
      }
      if (key === UP) {
        if (active > 0) active--;
      } else {
        if (active < commands.length - 1) active++;
      }
      this.setState({ active });
    }
  }

  onFilter(e) {
    const filter = e.target.value;
    const key = filter.toLowerCase().substr(1);
    this.setState({
      commands: Object.keys(allCommands).filter(c =>
        allCommands[c].title.toLowerCase().includes(key)
      ),
      filter,
      active: 0,
    });
  }

  componentDidUpdate() {
    this.input.focus();
  }

  componentDidMount() {
    setTimeout(() => {
      this.input.focus();
    });
  }

  render() {
    const { filter, active, commands } = this.state;
    return (
      <div className="Palette">
        <div className="inner">
          <input
            ref={e => (this.input = e)}
            type="text"
            value={filter}
            autoFocus
            onKeyDown={this.onKeyDown}
            onChange={this.onFilter}
          />
          <ul>
            {commands.map((command, i) =>
              <li
                className={classnames({ active: i === active })}
                key={`command-${i}`}
                onClick={() => this.onRun(command)}
              >
                {allCommands[command].title}
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

Palette.propTypes = {
  dismiss: PropTypes.func,
  run: PropTypes.func,
};
