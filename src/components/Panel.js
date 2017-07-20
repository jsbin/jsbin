import React from 'react';
import CodeMirror from 'react-codemirror';

import '../css/Panel.css';
import 'codemirror/lib/codemirror.css';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: '// this is some code' };
    this.updateCode = this.updateCode.bind(this);
  }

  updateCode(newCode) {
    this.setState({
      code: newCode
    });
  }

  render() {
    const { code } = this.state;
    const options = { lineNumbers: true };

    return (
      <div className="Panel">
        <CodeMirror value={code} onChange={this.updateCode} options={options} />
      </div>
    );
  }
}
