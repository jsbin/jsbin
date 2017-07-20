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

CodeMirror.displayName = 'CodeMirror';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: props.code };
    this.updateCode = this.updateCode.bind(this);
  }

  updateCode(newCode) {
    this.setState({
      code: newCode
    });
  }

  render() {
    const { code } = this.state;
    const { mode } = this.props;
    const options = { lineNumbers: true, mode, fixedGutter: false };

    if (options.mode === 'html') {
      options.mode = {
        name: 'htmlmixed',
        scriptTypes: [
          {
            matches: /\/x-handlebars-template|\/x-mustache/i,
            mode: null
          },
          {
            matches: /(text|application)\/(x-)?vb(a|script)/i,
            mode: 'vbscript'
          }
        ]
      };
    }

    return (
      <div className="Panel">
        <CodeMirror value={code} onChange={this.updateCode} options={options} />
      </div>
    );
  }
}

Panel.propTypes = {
  mode: PropTypes.string.isRequired,
  code: PropTypes.string
};
