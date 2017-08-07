import { connect } from 'react-redux';
import Mirror from '../components/Mirror';
import {
  setCursor,
  setDirtyFlag,
  setHighlightedLines,
} from '../actions/session';

const mapDispatchToProps = dispatch => {
  return {
    setHighlightedLines: lines => dispatch(setHighlightedLines(lines)),
    setCursor: ({ line, ch, source }) => {
      dispatch(setCursor(source, line, ch));
    },
    setDirtyFlag: flag => dispatch(setDirtyFlag(flag)),
  };
};

const MirrorContainer = connect(
  ({ bin, editor, session, app, snippets }) => ({
    editor,
    session,
    app,
    dirty: session.dirty,
    source: app.source,
    processor: bin[`${app.source}-processor`],
    snippets: snippets[app.source],
    error: session.error,
  }),
  mapDispatchToProps
)(Mirror);

export default MirrorContainer;
