import { connect } from 'react-redux';
import Settings from '../components/Settings';
import { massUpdate } from '../actions/editor';
import { setSplitterWidth } from '../actions/app';
import { saveSettings } from '../actions/user';
import { setDirtyFlag } from '../actions/session';

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
