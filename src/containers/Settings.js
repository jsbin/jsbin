import { connect } from 'react-redux';
import Settings from '../components/Settings';
import { setSplitterWidth, massUpdate } from '../actions/editor';
import { saveSettings } from '../actions/user';
import { setDirtyFlag } from '../actions/session';

const SettingsContainer = connect(
  ({ editor, session, user }) => ({
    editor,
    session,
    user,
  }),
  { setSplitterWidth, massUpdate, saveSettings, setDirtyFlag }
)(Settings);

export default SettingsContainer;
