import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml'; // html
import 'codemirror/mode/htmlmixed/htmlmixed';

import 'codemirror/lib/codemirror.css';
import '../css/Panel.css';
import '../css/CodeMirror.css';

import * as MODES from '../lib/cm-modes';

CodeMirror.displayName = 'CodeMirror';

const STATIC = process.env.REACT_APP_STATIC;

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: props.code };
    this.updateCode = this.updateCode.bind(this);
    this.loadTheme = this.loadTheme.bind(this);
  }

  loadTheme(theme) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${STATIC}/cm-themes/${theme}.css`;
    document.head.appendChild(link);
  }

  componentDidMount() {
    const { theme } = this.props;
    if (theme !== 'default') {
      // lazy load the theme css
      this.loadTheme(theme);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.theme !== this.props.theme) {
      // load the CSS for the new theme
      this.loadTheme(this.props.theme);
    }
  }

  updateCode(newCode) {
    this.props.changeCode(newCode);
    this.setState({
      code: newCode
    });
  }

  render() {
    const { code } = this.state;
    const { mode, theme } = this.props;
    const options = {
      lineNumbers: true,
      mode,
      fixedGutter: false,
      theme
    };

    if (options.mode === MODES.HTML) {
      options.mode = {
        name: 'htmlmixed',
        scriptTypes: [
          {
            matches: /\/x-handlebars-template|\/x-mustache/i,
            mode: null
          }
        ]
      };
    }

    return (
      <div className="Panel">
        <CodeMirror
          ref={e => (this.CodeMirror = e)}
          value={code}
          onChange={this.updateCode}
          options={options}
        />
      </div>
    );
  }
}

Panel.propTypes = {
  mode: PropTypes.string.isRequired,
  code: PropTypes.string,
  theme: PropTypes.string,
  changeCode: PropTypes.func
};
