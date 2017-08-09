import React from 'react';
import PropTypes from 'prop-types';
import Splitter from '@remy/react-splitter-layout';
import { HotKeys } from 'react-hotkeys';
// import stripComments from 'strip-json-comments';
// import Dictionary from '../lib/common/Dictionary';
// import TextEditorAutocompleteController from '../lib/TextEditor/AutoCompleteController';
import Footer from '../components/Footer';
import { Command } from './Symbols';
import Mirror from '../components/Mirror'; // explicit about component
import { settings as defaults, parse } from '../lib/Defaults';
import { merge } from '../lib/settings';
import { cmd } from '../lib/is-mac';
import Head from './Head';

import { TextUtils } from '../lib/common/TextUtils';

// intentionally after Mirror component
import JSONLint from 'json-lint';
import CodeMirror from 'codemirror';
import '../css/App.css';
import '@remy/react-splitter-layout/src/stylesheets/index.css';

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
  } catch (e) {
    console.log('Settings failed to lint');
  }

  return found;
});

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.validateSettings = this.validateSettings.bind(this);
    this.save = this.save.bind(this);

    this.refresh = this.refresh.bind(this);
    this.state = {
      error: null,
      settings: props.user.settings,
    };
  }

  refresh() {
    this.settings.refresh();
    this.defaults.refresh();
  }

  isWordChar(char) {
    return (
      (!TextUtils.isStopChar(char) && !TextUtils.isSpaceChar(char)) ||
      char === '.'
    );
  }

  componentDidMount() {
    // const cm = this.settings.CodeMirror.getCodeMirror();

    // const data = stripComments(defaults);

    // TextUtils.textToWords(data, this.isWordChar, word => {
    //   if (word.length && (word[0] < '0' || word[0] > '9'))
    //     this._dictionary.addWord(word);
    // });

    // this._autocompleteController = new TextEditorAutocompleteController(
    //   this,
    //   cm,
    //   {
    //     suggestionsCallback: (...args) => {
    //       console.log('suggestionsCallback', args);
    //     },
    //     isWordChar: this.isWordChar.bind(this),
    //   }
    // );

    this.refresh();
  }

  componentDidUpdate() {
    this.refresh();
  }

  validateSettings(settings) {
    let res = null;
    this.setState({ settings });
    try {
      res = parse(settings);

      this.setState({
        error: null,
      });
    } catch (error) {
      console.error(error.message.split('\n').map(_ => _.trim()).join(' '));
      this.setState({ error: error.message });
    }
    return res;
  }

  save(e) {
    e.preventDefault();
    const { settings } = this.state;
    let res = this.validateSettings(settings);
    if (res !== null) {
      this.props.massUpdate(merge(parse(defaults), res));
      this.props.saveSettings(settings);
      this.setState({ settings });
    }
  }

  render() {
    const { editor, user, app } = this.props;
    const { error } = this.state;

    const extraKeys = editor.extraKeys || {};
    extraKeys['Cmd-S'] = 'noop';

    const options = {
      autoFormatOptions: {
        preserve_newlines: false,
      },
      mode: 'application/javascript', // this allows comments
      lineWrapping: true,
      lineNumbers: true,
      matchBrackets: false,
      source: 'javascript',
      autoFormat: true,
      ...editor,
    };

    options.extraKeys = extraKeys;

    return (
      <div className={`theme-${app.theme}`}>
        <Head title="Settings" />
        <HotKeys keyMap={keyMap} handlers={{ save: this.save }}>
          <Splitter
            vertical={false}
            primaryIndex={0}
            percentage={true}
            secondaryInitialSize={60}
            onSize={this.refresh}
          >
            <div>
              <Mirror
                ref={e => (this.settings = e)}
                focus={true}
                changeCode={this.validateSettings}
                options={options}
                source="javascript"
                app={app}
                code={user.settings}
                editor={editor}
              />
              <Footer error={error}>
                <p>
                  <button className="Button simple" onClick={this.save}>
                    Save settings
                  </button>{' '}
                  <kbd>
                    <Command /> S
                  </kbd>
                </p>
              </Footer>
            </div>
            <Mirror
              ref={e => (this.defaults = e)}
              focus={false}
              options={{
                ...options,
                readOnly: true,
              }}
              source="javascript"
              app={app}
              code={defaults}
              editor={editor}
            />
          </Splitter>
        </HotKeys>
      </div>
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
  app: PropTypes.object,
};

Settings.defaultProps = {
  setSplitterWidth: () => {},
};
