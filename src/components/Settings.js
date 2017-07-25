import React from 'react';
import PropTypes from 'prop-types';
import stripJsonComments from 'strip-json-comments';
import Splitter from '@remy/react-splitter-layout';
import { HotKeys } from 'react-hotkeys';

import Footer from '../components/Footer';
import { Command } from './Symbols';
import Mirror from '../components/Mirror'; // explicit about component
import { settings as defaults, parse } from '../lib/Defaults';
import { cmd } from '../lib/is-mac';

// intentionally after Mirror component
import JSONLint from 'json-lint';
import CodeMirror from 'codemirror';
import '../css/App.css';
import '../css/Settings.css';

const keyMap = {
  save: `${cmd}+s`,
};

CodeMirror.registerHelper('lint', 'json', text => {
  const found = [];

  try {
    const lint = JSONLint(text);
    if (lint.error) {
      found.push({
        from: CodeMirror.Pos(lint.line - 1, lint.character - 1),
        to: CodeMirror.Pos(lint.line - 1, lint.character),
        message: lint.error,
      });
    }
  } catch (e) {}

  return found;
});

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.validateSettings = this.validateSettings.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      error: null,
      settings: props.user.settings,
    };
  }

  refresh() {
    this.settings.refresh();
    this.defaults.refresh();
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate() {
    this.refresh();
  }

  validateSettings(settings) {
    let res = null;
    try {
      res = parse(JSON.parse(stripJsonComments(settings)));

      this.setState({
        error: null,
        settings,
      });
    } catch (error) {
      console.dir(error);
      this.setState({ error: error.message });
    }
    return res;
  }

  save(e) {
    e.preventDefault();
    const { settings } = this.state;
    const res = this.validateSettings(settings);
    if (res !== null) {
      this.props.massUpdate(res.editor);
      this.props.saveSettings(settings);
      this.setState({ settings });
    }
  }

  render() {
    const { editor, user } = this.props;
    const { error } = this.state;

    return (
      <HotKeys keyMap={keyMap} handlers={{ save: this.save }}>
        <Splitter
          vertical={false}
          primaryIndex={0}
          percentage={true}
          onSize={size => {
            this.props.setSplitterWidth(size);
          }}
          secondaryInitialSize={100 - editor.splitterWidth}
        >
          <div>
            <Mirror
              ref={e => (this.settings = e)}
              focus={true}
              changeCode={this.validateSettings}
              options={{
                mode: 'application/ld+json', // this allows comments
                lineWrapping: true,
                lineNumbers: true,
                lint: true,
              }}
              code={user.settings}
              editor={editor}
            />
            <Footer error={error}>
              <p>
                Save settings{' '}
                <kbd>
                  <Command /> S
                </kbd>
              </p>
            </Footer>
          </div>
          <Mirror
            ref={e => (this.defaults = e)}
            focus={false}
            changeCode={this.validateSettings}
            options={{
              mode: 'application/ld+json',
              lineNumbers: true,
              lineWrapping: true,
              readOnly: true,
            }}
            code={JSON.stringify(defaults, '', 2)}
            editor={editor}
          />
        </Splitter>
      </HotKeys>
    );
  }
}

Settings.propTypes = {
  editor: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  massUpdate: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  setSplitterWidth: PropTypes.func,
  setDirtyFlag: PropTypes.func,
};

Settings.defaultProps = {
  setSplitterWidth: () => {},
};
