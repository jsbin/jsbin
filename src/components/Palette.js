import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';

import * as allCommands from '../lib/commands';
import * as gotoCommands from '../lib/goto-commands';
import '../css/Palette.css';

import Keys from '../lib/common/Keys';

const fuseOptions = {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {
      name: 'title',
      weight: 0.7,
    },
    {
      name: 'meta',
      weight: 0.3,
    },
  ],
};

export default class Palette extends React.Component {
  constructor(props) {
    super(props);

    this.onFilter = this.onFilter.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.selectCommand = this.selectCommand.bind(this);

    this.focusTimer = null;

    this.state = this.reset(false);
  }

  reset(setState = true) {
    const commands = Object.keys(allCommands)
      .map(key => allCommands[key])
      .filter(command => {
        if (command.condition) {
          return command.condition({ ...this.props });
        }
        return true;
      });

    const fuse = new Fuse(commands, fuseOptions);
    const state = { commands, fuse, filter: '', active: 0 };
    if (setState) {
      this.setState(state);
    }

    return state;
  }

  async onRun(command) {
    if (!command) {
      return;
    }

    if (!command.run) {
      return this.dismiss();
    }

    const res = await this.props.run(command, {
      ...this.props,
      filter: this.state.filter,
    });

    if (Array.isArray(res)) {
      this.setState({
        active: 0,
        commands: res,
        fuse: new Fuse(res, fuseOptions),
      });
      return;
    }

    if (typeof res === 'string') {
      // insert this into the
      this.props.insert(res);
    }

    this.dismiss();
  }

  dismiss() {
    this.props.dismiss();
  }

  selectCommand(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ filter: '' });

    const { commands, active } = this.state;

    this.onRun(commands[active]);
  }

  onKeyDown(e) {
    const key = e.which;

    const wanted = [
      Keys.Up.code,
      Keys.Down.code,
      Keys.Enter.code,
      Keys.Semicolon.code,
    ];

    if (wanted.includes(key)) {
      let { active, commands } = this.state;

      // NOTE before preventDefault to allow the character to appear
      if (key === Keys.Semicolon.code) {
        const res = Object.keys(gotoCommands).map(key => gotoCommands[key]);
        this.setState({
          active: 0,
          commands: res,
          fuse: new Fuse(res, {
            ...fuseOptions,
            threshold: 1,
          }),
        });
        return;
      }

      e.preventDefault();
      if (key === Keys.Enter.code) {
        return this.selectCommand(e);
      }

      if (key === Keys.Up.code) {
        if (active > 0) active--;
      } else {
        // down
        if (active < commands.length - 1) active++;
      }

      // try to scroll the element into view
      const li = this.commands.childNodes[active];
      if (li) {
        if (li.scrollIntoViewIfNeeded) {
          li.scrollIntoViewIfNeeded();
        } else {
          li.scrollIntoView();
        }
      }
      this.setState({ active });
    }
  }

  onFilter(e) {
    const filter = e.target.value;
    const needle = filter.toLowerCase().replace(/^>\s*/, '').trim();

    if (filter === '') {
      return this.reset();
    }

    if (filter.startsWith('+')) {
      return this.setState({
        commands: [
          {
            title: 'Add asset by URL…',
            run: (dispatch, { filter }) =>
              `<script src="${filter.substr(1)}"></script>`,
          },
        ],
        filter,
        active: 0,
      });
    }

    const { fuse } = this.state;

    const commands = fuse.search(needle).slice(0, 20);

    this.setState({
      commands,
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
    const { filter, active, commands } = this.state;

    const start = active - 100 < 0 ? 0 : active - 100;
    const end = start + 100;

    return (
      <div className="Palette" onClick={this.dismiss}>
        <div className="inner">
          <input
            ref={e => (this.input = e)}
            type="text"
            value={filter}
            autoFocus
            onClick={e => e.stopPropagation()}
            onKeyDown={this.onKeyDown}
            onChange={this.onFilter}
          />
          <ul ref={e => (this.commands = e)}>
            {commands.slice(start, end).map((command, i) =>
              <li
                onMouseOver={() => this.setState({ active: i })}
                className={classnames({ active: i === active })}
                key={`command-${i}`}
                onClick={this.selectCommand}
              >
                {command.display || command.title}
                {command.shortcut && command.shortcut}
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

Palette.propTypes = {
  app: PropTypes.object,
  dismiss: PropTypes.func,
  run: PropTypes.func,
  insert: PropTypes.func,
};

Palette.defaultProps = {
  app: {},
  dismiss: () => {},
  run: () => {},
  insert: () => {},
};
