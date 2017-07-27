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
  ({ editor, session, app, snippets }) => ({
    editor,
    session,
    app,
    dirty: session.dirty,
    source: app.source,
    snippets: snippets[app.source],
  }),
  mapDispatchToProps
)(Mirror);

export default MirrorContainer;
