import { connect } from 'react-redux';
import Settings from '../components/Settings';
import { massUpdate } from '../actions/app';
import { saveSettings } from '../actions/user';
import { setSplitterWidth, setDirtyFlag } from '../actions/session';

const SettingsContainer = connect(
  ({ editor, session, user, app }) => ({
    app,
    editor,
    session,
    user,
  }),
  { setSplitterWidth, massUpdate, saveSettings, setDirtyFlag }
)(Settings);

export default SettingsContainer;
