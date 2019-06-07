import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import ms from 'ms';
import classnames from 'classnames';
import 'react-select/dist/react-select.css';
import { getConfig } from '../lib/processor';
import { Command } from './Symbols';

import {
  RESULT_PAGE,
  RESULT_CONSOLE,
  RESULT_BOTH,
  RESULT_NONE,
} from '../actions/session';

import * as MODES from '../lib/cm-modes';

const noop = () => {};

class Updated extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      words: ms(Date.now() - new Date(props.updated).getTime())
    }

    this.updateTimer = this.updateTimer.bind(this);
  }

  updateTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ words: ms(Date.now() - new Date(this.props.updated).getTime())})
    }, 5000);
  }

  componentDidMount() {
    this.updateTimer();
  }

  componentDidUpdate() {
    this.updateTimer();
  }

  render() {
    return <small className="last-saved">Saved {this.state.words} ago</small>
  }


}

export default class CodeSettings extends React.Component {
  constructor(props) {
    super(props);
    this.changeSource = this.changeSource.bind(this);
    this.changeResult = this.changeResult.bind(this);
    this.changeEditor = this.changeEditor.bind(this);
    this.changeApp = this.changeApp.bind(this);
    this.changeBin = this.changeBin.bind(this);
    this.state = { height: 0 };
  }

  changeResult(value) {
    this.props.changeResult(value);
  }

  changeSource(value) {
    this.props.setSource(value);
  }

  changeApp(property, value) {
    this.props.toggleLayout(value);
  }

  changeEditor(property, value) {
    this.props.set(property, value);
  }

  optionRenderer(option) {
    return (
      <div
        className={classnames({ Option: true, processor: option.processor })}
      >
        <span>
          {option.label}
        </span>
        {option.shortcut && option.shortcut}
      </div>
    );
  }

  changeBin(property, value) {}

  render() {
    const {
      updated,
      bin,
      lineWrapping,
      lineNumbers,
      source,
      result,
      splitColumns,
    } = this.props;

    const selectDefaults = {
      autosize: false,
      openOnFocus: true,
      clearable: false,
      searchable: false,
      autoBlur: false,
      simpleValue: true,
      optionRenderer: this.optionRenderer,
    };

    const sourceOptions = [
      {
        value: MODES.HTML,
        label: getConfig(bin[MODES.HTML + '-processor']).label,
        shortcut: (
          <kbd>
            <Command /> 1
          </kbd>
        ),
      },
      {
        value: MODES.CSS,
        label: getConfig(bin[MODES.CSS + '-processor']).label,
        shortcut: (
          <kbd>
            <Command /> 2
          </kbd>
        ),
      },
      {
        value: MODES.JAVASCRIPT,
        label: getConfig(bin[MODES.JAVASCRIPT + '-processor']).label,
        shortcut: (
          <kbd>
            <Command /> 3
          </kbd>
        ),
      },
    ];

    const resultOptions = [
      {
        value: RESULT_PAGE,
        label: 'Page',
      },
      {
        value: RESULT_CONSOLE,
        label: 'Console',
      },
      {
        value: RESULT_BOTH,
        label: 'Both',
      },
      {
        value: RESULT_NONE,
        label: 'None',
      },
    ];

    return (
      <div className="CodeSettings">
        <label className="grow">
          <span onClick={e => this.source.focus()}>Source</span>
          <Select
            ref={e => (this.source = e)}
            value={source}
            onChange={this.changeSource}
            options={sourceOptions}
            {...selectDefaults}
          />

        {updated ?
          <Updated updated={updated}/> : <small className="last-saved">Not saved yet</small>}
        </label>
        <label className="result grow">
          <span onClick={e => this.result.focus()}>Result</span>
          <Select
            ref={e => (this.result = e)}
            value={result}
            onChange={this.changeResult}
            options={resultOptions}
            {...selectDefaults}
          />
        </label>
        <details>
          <summary>Quick Settings</summary>
          <label>
            <input
              name="lineNumbers"
              type="checkbox"
              onChange={e => {
                this.changeEditor('lineNumbers', e.target.checked);
              }}
              checked={lineNumbers}
            />{' '}
            Line numbers
          </label>

          <label>
            <input
              name="lineWrapping"
              type="checkbox"
              onChange={e => {
                this.changeEditor('lineWrapping', e.target.checked);
              }}
              checked={lineWrapping}
            />{' '}
            Line wrap
          </label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="splitColumns"
                checked={splitColumns === true}
                value="vertical"
                onChange={e => {
                  this.changeApp('splitColumns', e.target.value === 'vertical');
                }}
              />
              Split vertically
            </label>
            <label>
              <input
                type="radio"
                name="splitColumns"
                checked={splitColumns !== true}
                value="vertical"
                onChange={e => {
                  this.changeApp('splitColumns', e.target.value !== 'vertical');
                }}
              />
              horizontally
            </label>
          </div>
        </details>
      </div>
    );
  }
}

CodeSettings.propTypes = {
  lineWrapping: PropTypes.bool.isRequired,
  lineNumbers: PropTypes.bool.isRequired,
  source: PropTypes.string.isRequired,
  result: PropTypes.string,
  // updated: PropTypes.string,
  splitColumns: PropTypes.bool,
  toggleResult: PropTypes.func,
  set: PropTypes.func,
  setSource: PropTypes.func,
  changeResult: PropTypes.func,
  onRefresh: PropTypes.func,
  toggleLayout: PropTypes.func,
};

CodeSettings.defaultProps = {
  toggleLayout: noop,
};
