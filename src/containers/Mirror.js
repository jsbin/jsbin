import { connect } from 'react-redux';
import Mirror from '../components/Mirror';
import { setCursor, setDirtyFlag } from '../actions/session';

const mapDispatchToProps = dispatch => {
  return {
    setCursor: ({ line, ch, source }) => {
      dispatch(setCursor(source, line, ch));
    },
    setDirtyFlag: flag => dispatch(setDirtyFlag(flag)),
  };
};

const MirrorContainer = connect(
  ({ editor, session, app }) => ({
    editor,
    session,
    app,
    dirty: session.dirty,
  }),
  mapDispatchToProps
)(Mirror);

export default MirrorContainer;
