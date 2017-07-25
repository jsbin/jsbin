import { connect } from 'react-redux';
import Settings from '../components/Settings';
import { setSplitterWidth } from '../actions/editor';

const mapDispatchToProps = dispatch => {
  return {
    setSplitterWidth: pos => dispatch(setSplitterWidth(pos)),
  };
};

const SettingsContainer = connect(
  ({ editor, session }) => ({
    editor,
    session,
  }),
  mapDispatchToProps
)(Settings);

export default SettingsContainer;
