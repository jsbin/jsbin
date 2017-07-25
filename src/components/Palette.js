import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import * as allCommands from '../lib/commands';
import '../css/Palette.css';

const UP = 38;
const DOWN = 40;
const ENTER = 13;

export function filter(needle, haystack) {
  const keys = needle.toLowerCase().replace(/^>\s*/, '').trim().split(/\s+/);
  console.log(keys);
  return Object.keys(haystack)
    .filter(c => {
      const title = haystack[c].title.toLowerCase();
      return keys.filter(key => title.includes(key)).length;
    })
    .sort((a, b) => {
      return a.indexOf(keys[0]) < b.indexOf(keys[0]);
    });
}

export default class Palette extends React.Component {
  constructor(props) {
    super(props);

    this.onFilter = this.onFilter.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.focusTimer = null;

    const all = { ...allCommands };

    this.state = {
      all,
      commands: [...Object.keys(all)],
      filter: '>',
      active: 0,
    };
  }

  async onRun(command) {
    const res = await this.props.run(command);
    if (!res) {
      this.props.dismiss();
    }

    if (Array.isArray(res)) {
      this.setState({ all: res, commands: res.map((x, i) => i) });
    }
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
    const { all } = this.state;
    const keys = filter.toLowerCase().replace(/^>\s*/, '').trim().split(/\s+/);
    console.log(keys);
    this.setState({
      commands: Object.keys(all)
        .filter(c => {
          const title = all[c].title.toLowerCase();
          return keys.filter(key => title.includes(key)).length;
        })
        .sort((a, b) => {
          return a.indexOf(keys[0]) < b.indexOf(keys[0]);
        }),
      filter,
      active: 0,
    });
  }

  componentDidUpdate() {
    this.input.focus();
  }

  componentDidMount() {
    /*
      This setTimeout is used due to a race condition:
      If the user opens the palette, and selects "new",
      since the commands are async, the command emits
      a RESET event, which causes the bin to empty out,
      but since the palette is still visible (according
      to the state), it's rendered - and `componentDidMount`
      is called, but the the DISMISS event fires which
      removes this component from the DOM, which causes
      `this.input` to be missing. Thus the check before
      the focus is run in the setTimeout - since it's
      scheduled _after_ the component has been removed.
    */
    this.focusTimer = setTimeout(() => {
      this.input.focus();
    });
  }

  componentWillUnmount() {
    clearTimeout(this.focusTimer);
  }

  render() {
    const { filter, active, commands, all } = this.state;
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
                {all[command].title}
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
