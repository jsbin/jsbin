import React from 'react';
import PropTypes from 'prop-types';

import Splitter from '@remy/react-splitter-layout';
import Mirror from '../components/Mirror'; // explicit about component

import '../css/Settings.css';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.validateSettings = this.validateSettings.bind(this);
    this.state = {
      error: null,
      settings: {},
    };
  }

  validateSettings(code) {
    try {
      this.setState({ settings: JSON.parse(code), error: null });
    } catch (error) {
      this.setState({ error: error.message.replace(/\n/g, ' ') });
    }
  }

  render() {
    const { editor } = this.props;
    const { error } = this.state;

    const settings = {
      'editor.theme': editor.theme,
      'editor.lineWrapping': editor.lineWrapping,
      'editor.lineNumbers': editor.lineNumbers,
    };

    return (
      <div>
        <Splitter
          vertical={false}
          percentage={true}
          secondaryInitialSize={50}
          primaryIndex={1}
        >
          <Mirror
            focus={false}
            changeCode={this.validateSettings}
            options={{ mode: 'application/json', lineNumbers: true }}
            code={JSON.stringify(settings, '', 2)}
            editor={editor}
          />
          <Mirror
            focus={!true}
            changeCode={this.validateSettings}
            options={{ mode: 'application/json', lineNumbers: true }}
            code={JSON.stringify(editor, '', 2)}
            editor={editor}
          />
        </Splitter>
        {error &&
          <pre className="error">
            {error}
          </pre>}
      </div>
    );
  }
}

Settings.propTypes = {
  editor: PropTypes.object.isRequired,
};
