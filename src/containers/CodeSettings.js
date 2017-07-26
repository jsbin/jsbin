import { connect } from 'react-redux';
import CodeSettings from '../components/CodeSettings';
import { toggleLayout } from '../actions/app';
import { set } from '../actions/editor';
import { changeOutput, setSource } from '../actions/session';
import { saveSettings } from '../actions/user';

const mapStateToProps = ({ editor, session, app, user }) => ({
  ...editor,
  source: session.source,
  output: session.output,
  vertical: app.vertical,
  userSettings: user.settings,
});

const CodeSettingsContainer = connect(mapStateToProps, {
  set,
  toggleLayout,
  setSource,
  changeOutput,
  saveSettings,
})(CodeSettings);

export default CodeSettingsContainer;
