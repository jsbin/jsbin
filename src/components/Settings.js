import React from 'react';
import PropTypes from 'prop-types';

import stripJsonComments from 'strip-json-comments';

import Splitter from '@remy/react-splitter-layout';
import Mirror from '../components/Mirror'; // explicit about component
import { settings as defaults, parse } from '../lib/Defaults';

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

  componentDidMount() {
    this.settings.refresh();
    this.defaults.refresh();
  }

  validateSettings(code) {
    try {
      parse(JSON.parse(stripJsonComments(code)));
      this.setState({
        error: null,
        // settings: parse(JSON.parse(stripJsonComments(code))),
      });
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
                mode: 'application/ld+json',
                lineWrapping: true,
                lineNumbers: true,
              }}
              code={JSON.stringify(settings, '', 2)}
              editor={editor}
            />
            {error &&
              <pre className="error">
                {error}
              </pre>}
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
            readOnly={true}
          />
        </Splitter>
      </div>
    );
  }
}

Settings.propTypes = {
  editor: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  setSplitterWidth: PropTypes.func.isRequired,
};
