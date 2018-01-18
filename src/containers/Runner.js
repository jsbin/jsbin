import { connect } from 'react-redux';
import Runner from '../components/Runner';
import { clearError, setError } from '../actions/session';
import { JAVASCRIPT, HTML } from '../lib/cm-modes';

const RunnerContainer = connect(
  ({ bin, session, app, processors }) => ({
    // stateToProps
    result: processors.result,
    updated: processors.updated,
    insertJS: processors.insertJS,
    javascript: processors[`${JAVASCRIPT}-result`],
    html: processors[`${HTML}-result`],
    error: session.error,
    splitColumns: app.splitColumns,
    theme: app.theme,
  }),
  { clearError, setError } // propsToDispatch
)(Runner);

export default RunnerContainer;
